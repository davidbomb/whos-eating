// Import the functions you need from the SDKs you need
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set, remove } from 'firebase/database';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Participant {
  name: string;
  isGuest: boolean;
  addedBy?: string;
}

export interface MealData {
  date: string;
  participants: Participant[];
}

export interface ShoppingItem {
  id: number;
  name: string;
  checked: boolean;
  showMagicStars?: boolean;
  fadingOut?: boolean;
  randomStarPositions?: {top: number, left: number}[];
}

export interface ShoppingListData {
  items: ShoppingItem[];
  lastUpdated: string;
}

export type MealType = 'lunch' | 'dinner';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private db: any;
  private lunchParticipantsSubject = new BehaviorSubject<Participant[]>([]);
  private dinnerParticipantsSubject = new BehaviorSubject<Participant[]>([]);
  private shoppingListSubject = new BehaviorSubject<ShoppingItem[]>([]);
  public lunchParticipants$: Observable<Participant[]> = this.lunchParticipantsSubject.asObservable();
  public dinnerParticipants$: Observable<Participant[]> = this.dinnerParticipantsSubject.asObservable();
  public shoppingList$: Observable<ShoppingItem[]> = this.shoppingListSubject.asObservable();
  private platformId = inject(PLATFORM_ID);
  private isBrowser: boolean;
  private isInitialized: boolean = false;

  constructor() {
    this.isBrowser = isPlatformBrowser(this.platformId);

    // N'initialiser Firebase que côté navigateur
    if (this.isBrowser) {
      console.log('🌐 Initialisation Firebase côté navigateur...');

      // Configuration Firebase
      const firebaseConfig = {
        apiKey: "AIzaSyBNORKbQDMjvMmovUWVAIKxmfOAcIpUtLY",
        authDomain: "whos-eating.firebaseapp.com",
        databaseURL: "https://whos-eating-default-rtdb.europe-west1.firebasedatabase.app",
        projectId: "whos-eating",
        storageBucket: "whos-eating.firebasestorage.app",
        messagingSenderId: "1027430586394",
        appId: "1:1027430586394:web:1f956d00af660575da59a3"
      };

      try {
        // Initialiser Firebase
        const app = initializeApp(firebaseConfig);
        this.db = getDatabase(app);
        this.isInitialized = true;
        console.log('✅ Firebase initialisé avec succès');
        console.log('📍 Database URL:', firebaseConfig.databaseURL);

        // Écouter les changements en temps réel pour les deux types de repas
        this.listenToChanges('lunch');
        this.listenToChanges('dinner');
        // Écouter les changements pour la liste de courses
        this.listenToShoppingList();
      } catch (error) {
        console.error('❌ Erreur lors de l\'initialisation Firebase:', error);
        this.isInitialized = false;
      }
    } else {
      console.log('⚠️ Exécution côté serveur - Firebase non initialisé');
    }
  }

  private listenToChanges(mealType: MealType) {
    if (!this.isBrowser || !this.isInitialized) {
      console.log('⚠️ listenToChanges - conditions non remplies:', {
        isBrowser: this.isBrowser,
        isInitialized: this.isInitialized
      });
      return;
    }

    const today = new Date().toDateString();
    // Utiliser le chemin lunches avec un suffixe pour le type de repas
    const dataRef = ref(this.db, `lunches/${today}-${mealType}`);

    console.log(`🔍 Démarrage de l'écoute des changements Firebase pour ${mealType}`);
    console.log('📅 Date du jour:', today);
    console.log('🔗 Chemin Firebase:', `lunches/${today}-${mealType}`);

    const subject = mealType === 'lunch' ? this.lunchParticipantsSubject : this.dinnerParticipantsSubject;

    try {
      onValue(dataRef, (snapshot) => {
        console.log(`📡 Événement Firebase reçu pour ${mealType}`);
        const data = snapshot.val();

        console.log(`📦 Données brutes ${mealType}:`, JSON.stringify(data, null, 2));

        if (data && data.participants) {
          console.log(`✅ Mise à jour ${mealType} avec`, data.participants.length, 'participants:',
            data.participants.map((p: Participant) => p.name).join(', '));
          subject.next(data.participants);
        } else {
          console.log(`ℹ️ Aucune donnée ${mealType} - réinitialisation tableau vide`);
          subject.next([]);
        }
      }, (error) => {
        console.error(`❌ Erreur Firebase onValue pour ${mealType}:`, error);
        console.error('Détails erreur:', {
          code: (error as any).code || 'unknown',
          message: error.message || String(error),
          stack: error.stack
        });
      });

      console.log(`✅ Listener Firebase configuré avec succès pour ${mealType}`);
    } catch (error) {
      console.error(`❌ Erreur lors de la configuration du listener ${mealType}:`, error);
    }
  }

  private listenToShoppingList() {
    if (!this.isBrowser || !this.isInitialized) {
      console.log('⚠️ listenToShoppingList - conditions non remplies:', {
        isBrowser: this.isBrowser,
        isInitialized: this.isInitialized
      });
      return;
    }

    const today = new Date().toDateString();
    const dataRef = ref(this.db, `shoppingList/${today}`);

    console.log(`🔍 Démarrage de l'écoute des changements Firebase pour la liste de courses`);
    console.log('📅 Date du jour:', today);
    console.log('🔗 Chemin Firebase:', `shoppingList/${today}`);

    try {
      onValue(dataRef, (snapshot) => {
        console.log(`📡 Événement Firebase reçu pour la liste de courses`);
        const data = snapshot.val();

        console.log(`📦 Données brutes liste de courses:`, JSON.stringify(data, null, 2));

        if (data && data.items) {
          console.log(`✅ Mise à jour de la liste de courses avec`, data.items.length, 'éléments:',
            data.items.map((item: ShoppingItem) => item.name).join(', '));
          this.shoppingListSubject.next(data.items);
        } else {
          console.log(`ℹ️ Aucune donnée pour la liste de courses - réinitialisation tableau vide`);
          this.shoppingListSubject.next([]);
        }
      }, (error) => {
        console.error(`❌ Erreur Firebase onValue pour la liste de courses:`, error);
        console.error('Détails erreur:', {
          code: (error as any).code || 'unknown',
          message: error.message || String(error),
          stack: error.stack
        });
      });

      console.log(`✅ Listener Firebase configuré avec succès pour la liste de courses`);
    } catch (error) {
      console.error(`❌ Erreur lors de la configuration du listener pour la liste de courses:`, error);
    }
  }

  async saveParticipants(participants: Participant[], mealType: MealType) {
    if (!this.isBrowser) {
      console.log('⚠️ saveParticipants appelé côté serveur - ignoré');
      return;
    }

    if (!this.isInitialized || !this.db) {
      console.error('❌ Firebase non initialisé - impossible de sauvegarder');
      return;
    }

    try {
      const today = new Date().toDateString();
      // Utiliser le chemin lunches avec un suffixe pour le type de repas
      const dataRef = ref(this.db, `lunches/${today}-${mealType}`);

      console.log(`💾 Tentative de sauvegarde dans Firebase pour ${mealType}`);
      console.log('📅 Date:', today);
      console.log('📊 Nombre de participants:', participants.length);
      console.log('👥 Participants:', participants.map(p => p.name).join(', '));

      const dataToSave = {
        date: today,
        participants: participants
      };

      console.log('📤 Données à sauvegarder:', JSON.stringify(dataToSave, null, 2));

      await set(dataRef, dataToSave);

      console.log(`✅ Sauvegarde Firebase réussie pour ${mealType}`);
    } catch (error) {
      console.error(`❌ Erreur lors de la sauvegarde Firebase ${mealType}:`, error);
      console.error('Détails erreur:', {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
    }
  }

  async resetDay(mealType: MealType) {
    if (!this.isBrowser) {
      console.log('⚠️ resetDay appelé côté serveur - ignoré');
      return;
    }

    if (!this.isInitialized || !this.db) {
      console.error('❌ Firebase non initialisé - impossible de réinitialiser');
      return;
    }

    try {
      const today = new Date().toDateString();
      // Utiliser le chemin lunches avec un suffixe pour le type de repas
      const dataRef = ref(this.db, `lunches/${today}-${mealType}`);

      console.log(`🔄 Tentative de réinitialisation Firebase pour ${mealType}`);
      console.log('📅 Date:', today);

      await remove(dataRef);

      console.log(`✅ Réinitialisation Firebase réussie pour ${mealType}`);
    } catch (error) {
      console.error(`❌ Erreur lors de la réinitialisation Firebase ${mealType}:`, error);
      console.error('Détails erreur:', {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : String(error)
      });
    }
  }

  async saveShoppingList(items: ShoppingItem[]) {
    if (!this.isBrowser) {
      console.log('⚠️ saveShoppingList appelé côté serveur - ignoré');
      return;
    }

    if (!this.isInitialized || !this.db) {
      console.error('❌ Firebase non initialisé - impossible de sauvegarder la liste de courses');
      return;
    }

    try {
      const today = new Date().toDateString();
      const dataRef = ref(this.db, `shoppingList/${today}`);

      console.log('💾 Tentative de sauvegarde de la liste de courses dans Firebase');
      console.log('📊 Nombre d\'éléments:', items.length);

      const dataToSave: ShoppingListData = {
        items: items,
        lastUpdated: new Date().toISOString()
      };

      console.log('📤 Données à sauvegarder:', JSON.stringify(dataToSave, null, 2));

      await set(dataRef, dataToSave);

      console.log('✅ Sauvegarde de la liste de courses réussie');
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde de la liste de courses:', error);
      console.error('Détails erreur:', {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined
      });
    }
  }

  async clearShoppingList() {
    if (!this.isBrowser) {
      console.log('⚠️ clearShoppingList appelé côté serveur - ignoré');
      return;
    }

    if (!this.isInitialized || !this.db) {
      console.error('❌ Firebase non initialisé - impossible de vider la liste de courses');
      return;
    }

    try {
      const today = new Date().toDateString();
      const dataRef = ref(this.db, `shoppingList/${today}`);

      console.log('🗑️ Tentative de suppression de la liste de courses dans Firebase');

      await remove(dataRef);

      console.log('✅ Liste de courses supprimée avec succès');
    } catch (error) {
      console.error('❌ Erreur lors de la suppression de la liste de courses:', error);
      console.error('Détails erreur:', {
        name: error instanceof Error ? error.name : 'Unknown',
        message: error instanceof Error ? error.message : String(error)
      });
    }
  }
}
