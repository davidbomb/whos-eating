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

export type MealType = 'lunch' | 'dinner';

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private db: any;
  private lunchParticipantsSubject = new BehaviorSubject<Participant[]>([]);
  private dinnerParticipantsSubject = new BehaviorSubject<Participant[]>([]);
  public lunchParticipants$: Observable<Participant[]> = this.lunchParticipantsSubject.asObservable();
  public dinnerParticipants$: Observable<Participant[]> = this.dinnerParticipantsSubject.asObservable();
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
}
