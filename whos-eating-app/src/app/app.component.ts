import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService, Participant } from './services/data.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnDestroy {
  title = 'Qui Mange Ce Midi ? 🍽️';

  familyMembers = ['Papa', 'Maman', 'David', 'Apo', 'Clovis', 'Julien'];
  participants: Participant[] = [];
  guestName: string = '';
  selectedMember: string = '';
  showGuestForm: boolean = false;

  // Easter Egg - Bougie décorative
  easterEggActivated: boolean = false;
  private easterEggAudio?: HTMLAudioElement;

  constructor(private dataService: DataService) {
    // S'abonner aux changements en temps réel depuis Firebase
    this.dataService.participants$.subscribe(participants => {
      this.participants = participants;
    });
  }

  getCurrentDate(): string {
    return new Date().toLocaleDateString('fr-FR', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  }

  getPlates(): Array<{top: number, left: number, transform: string}> {
    const plates = [];
    const count = this.totalCount;

    // Rayon du cercle pour positionner les assiettes (en pourcentage)
    const radius = 42; // Distance du centre à l'assiette
    const centerX = 50; // Centre X en %
    const centerY = 50; // Centre Y en %

    for (let i = 0; i < count; i++) {
      // Calcul de l'angle pour répartir équitablement les assiettes
      // On commence à -90° (en haut) pour que la première assiette soit en haut
      const angle = (i * 360 / count) - 90;
      const angleRad = angle * Math.PI / 180;

      // Calcul des positions X et Y
      const x = centerX + radius * Math.cos(angleRad);
      const y = centerY + radius * Math.sin(angleRad);

      plates.push({
        top: y,
        left: x,
        transform: `translate(-50%, -50%) rotate(${angle}deg)`
      });
    }

    return plates;
  }

  get totalCount(): number {
    return this.participants.length;
  }

  hasMemberRegistered(member: string): boolean {
    return this.participants.some(p => p.name === member && !p.isGuest);
  }

  addMember(member: string) {
    if (!this.hasMemberRegistered(member)) {
      const newParticipants = [...this.participants, {
        name: member,
        isGuest: false
      }];
      this.dataService.saveParticipants(newParticipants);
    }
  }

  removeMember(member: string) {
    // Retirer le membre et tous ses invités
    const newParticipants = this.participants.filter(
      p => !(p.name === member && !p.isGuest) && p.addedBy !== member
    );
    this.dataService.saveParticipants(newParticipants);
  }

  addGuest(addedBy: string) {
    if (this.guestName.trim() && addedBy) {
      const newParticipants = [...this.participants, {
        name: this.guestName.trim(),
        isGuest: true,
        addedBy: addedBy
      }];
      this.guestName = '';
      this.showGuestForm = false;
      this.selectedMember = '';
      this.dataService.saveParticipants(newParticipants);
    }
  }

  removeParticipant(participant: Participant) {
    const newParticipants = this.participants.filter(p => p !== participant);
    this.dataService.saveParticipants(newParticipants);
  }

  openGuestForm(member: string) {
    this.selectedMember = member;
    this.showGuestForm = true;
  }

  cancelGuestForm() {
    this.showGuestForm = false;
    this.guestName = '';
    this.selectedMember = '';
  }

  resetDay() {
    // Réinitialiser dans Firebase
    this.dataService.resetDay();
  }

  // 🕯️ Easter Egg - Bougie Décorative
  toggleEasterEggMusic() {
    console.log('🎵 Toggle Easter Egg Music - Activated:', !this.easterEggActivated);
    this.easterEggActivated = !this.easterEggActivated;

    if (this.easterEggActivated) {
      this.playEasterEggMusic();
    } else {
      this.stopEasterEggMusic();
    }
  }

  private playEasterEggMusic() {
    console.log('🎵 Tentative de lecture de la musique...');

    // Créer l'élément audio s'il n'existe pas
    if (!this.easterEggAudio) {
      console.log('🎵 Création du lecteur audio...');
      this.easterEggAudio = new Audio();
      // Utiliser un chemin relatif qui fonctionne en dev et en prod
      this.easterEggAudio.src = 'assets/perceval-cheque-de-caution.mp3';
      this.easterEggAudio.loop = true; // Lecture en boucle
      this.easterEggAudio.volume = 0.5; // Volume à 50%

      // Précharger l'audio
      this.easterEggAudio.load();

      // Événements pour déboguer
      this.easterEggAudio.addEventListener('canplay', () => {
        console.log('🎵 Audio prêt à être joué');
      });

      this.easterEggAudio.addEventListener('error', (e) => {
        console.error('🎵 Erreur de chargement audio:', e);
        console.error('🎵 Source:', this.easterEggAudio?.src);
        console.error('🎵 URL complète:', window.location.origin + '/' + this.easterEggAudio?.src);
      });

      this.easterEggAudio.addEventListener('play', () => {
        console.log('🎵 Lecture démarrée');
      });

      this.easterEggAudio.addEventListener('pause', () => {
        console.log('🎵 Lecture en pause');
      });
    }

    // Jouer la musique avec gestion d'erreur améliorée
    console.log('🎵 Appel de play()...');
    const playPromise = this.easterEggAudio.play();

    if (playPromise !== undefined) {
      playPromise
        .then(() => {
          console.log('🎵 Lecture réussie!');
        })
        .catch(error => {
          console.error('🎵 Erreur lors de la lecture:', error);
          console.error('🎵 Type d\'erreur:', error.name);
          console.error('🎵 Message:', error.message);

          // Si c'est une erreur d'interaction utilisateur requise
          if (error.name === 'NotAllowedError') {
            console.warn('🎵 L\'interaction utilisateur est requise pour jouer l\'audio sur mobile');
            // Réessayer avec un événement utilisateur
            alert('Cliquez sur OK pour activer la musique');
            this.easterEggAudio?.play().catch(e => {
              console.error('🎵 Échec après interaction:', e);
              this.easterEggActivated = false;
            });
          } else {
            this.easterEggActivated = false;
          }
        });
    }
  }

  private stopEasterEggMusic() {
    console.log('🎵 Arrêt de la musique...');
    if (this.easterEggAudio) {
      this.easterEggAudio.pause();
      this.easterEggAudio.currentTime = 0; // Remettre au début
      console.log('🎵 Musique arrêtée');
    }
  }

  ngOnDestroy() {
    this.stopEasterEggMusic();
    if (this.easterEggAudio) {
      // Nettoyer les listeners
      this.easterEggAudio.pause();
      this.easterEggAudio.src = '';
      this.easterEggAudio.load();
      this.easterEggAudio = undefined;
    }
  }
}
