// Import the functions you need from the SDKs you need
import { Injectable } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getDatabase, ref, onValue, set, remove } from 'firebase/database';
import { BehaviorSubject, Observable } from 'rxjs';

export interface Participant {
  name: string;
  isGuest: boolean;
  addedBy?: string;
}

export interface LunchData {
  date: string;
  participants: Participant[];
}

@Injectable({
  providedIn: 'root'
})
export class DataService {
  private db: any;
  private participantsSubject = new BehaviorSubject<Participant[]>([]);
  public participants$: Observable<Participant[]> = this.participantsSubject.asObservable();

  constructor() {
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
      console.log('✅ Firebase initialisé avec succès');

      // Écouter les changements en temps réel
      this.listenToChanges();
    } catch (error) {
      console.error('❌ Erreur lors de l\'initialisation Firebase:', error);
    }
  }

  private listenToChanges() {
    const today = new Date().toDateString();
    const dataRef = ref(this.db, `lunches/${today}`);

    console.log('🔍 Écoute des changements pour:', today);

    onValue(dataRef, (snapshot) => {
      const data = snapshot.val();
      console.log('📡 Données reçues de Firebase:', data);

      if (data && data.participants) {
        console.log('✅ Mise à jour avec', data.participants.length, 'participants');
        this.participantsSubject.next(data.participants);
      } else {
        console.log('ℹ️ Aucune donnée - tableau vide');
        this.participantsSubject.next([]);
      }
    }, (error) => {
      console.error('❌ Erreur lors de la lecture Firebase:', error);
    });
  }

  async saveParticipants(participants: Participant[]) {
    try {
      const today = new Date().toDateString();
      const dataRef = ref(this.db, `lunches/${today}`);

      console.log('💾 Sauvegarde de', participants.length, 'participants dans Firebase');

      await set(dataRef, {
        date: today,
        participants: participants
      });

      console.log('✅ Sauvegarde réussie');
    } catch (error) {
      console.error('❌ Erreur lors de la sauvegarde:', error);
    }
  }

  async resetDay() {
    try {
      const today = new Date().toDateString();
      const dataRef = ref(this.db, `lunches/${today}`);

      console.log('🔄 Réinitialisation de la journée');

      await remove(dataRef);

      console.log('✅ Réinitialisation réussie');
    } catch (error) {
      console.error('❌ Erreur lors de la réinitialisation:', error);
    }
  }
}
