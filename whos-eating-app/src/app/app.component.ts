import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DataService, Participant } from './services/data.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Qui Mange Ce Midi ? 🍽️';

  familyMembers = ['Papa', 'Maman', 'David', 'Apo', 'Clovis', 'Julien'];
  participants: Participant[] = [];
  guestName: string = '';
  selectedMember: string = '';
  showGuestForm: boolean = false;

  // Easter Egg Musical
  musicActivated: boolean = false;
  private audioContext?: AudioContext;
  private currentSource?: AudioBufferSourceNode;

  // Easter Egg - Bougie décorative
  easterEggActivated: boolean = false;
  private easterEggAudio?: HTMLAudioElement;

  constructor(private dataService: DataService) {}

  ngOnInit() {
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

  getEmojis(): string {
    if (this.totalCount === 0) return '😴';
    const emoji = '🍽️';
    return emoji.repeat(Math.min(this.totalCount, 10));
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

  get availableMembers(): string[] {
    return this.familyMembers.filter(
      member => !this.participants.some(p => p.name === member && !p.isGuest)
    );
  }

  hasMemberRegistered(member: string): boolean {
    return this.participants.some(p => p.name === member && !p.isGuest);
  }

  hasAnyRegistered(): boolean {
    return this.participants.some(p => !p.isGuest);
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

  // 🎵 Easter Egg Musical - Toggle Music
  toggleMusic() {
    this.musicActivated = !this.musicActivated;

    if (this.musicActivated) {
      this.playMedievalMusic();
    } else {
      this.stopMusic();
    }
  }

  private playMedievalMusic() {
    // Créer un contexte audio si nécessaire
    if (!this.audioContext) {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
    }

    // Créer une mélodie médiévale simple avec l'API Web Audio
    this.playMelody();
  }

  private playMelody() {
    if (!this.audioContext) return;

    const ctx = this.audioContext;
    const now = ctx.currentTime;

    // Mélodie médiévale festive (notes en Hz)
    // Utilisant une gamme médiévale pentatonique
    const melody = [
      { freq: 523.25, start: 0, duration: 0.3 },    // C5
      { freq: 587.33, start: 0.3, duration: 0.3 },  // D5
      { freq: 659.25, start: 0.6, duration: 0.3 },  // E5
      { freq: 698.46, start: 0.9, duration: 0.3 },  // F5
      { freq: 783.99, start: 1.2, duration: 0.4 },  // G5
      { freq: 698.46, start: 1.6, duration: 0.2 },  // F5
      { freq: 659.25, start: 1.8, duration: 0.2 },  // E5
      { freq: 587.33, start: 2.0, duration: 0.4 },  // D5
      { freq: 523.25, start: 2.4, duration: 0.6 },  // C5
    ];

    melody.forEach(note => {
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.type = 'triangle'; // Son médiéval doux
      oscillator.frequency.value = note.freq;

      // Enveloppe ADSR pour un son plus naturel
      gainNode.gain.setValueAtTime(0, now + note.start);
      gainNode.gain.linearRampToValueAtTime(0.3, now + note.start + 0.05);
      gainNode.gain.linearRampToValueAtTime(0.2, now + note.start + note.duration * 0.7);
      gainNode.gain.linearRampToValueAtTime(0, now + note.start + note.duration);

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      oscillator.start(now + note.start);
      oscillator.stop(now + note.start + note.duration);
    });

    // Répéter la mélodie
    if (this.musicActivated) {
      setTimeout(() => {
        if (this.musicActivated) {
          this.playMelody();
        }
      }, 3000);
    }
  }

  private stopMusic() {
    if (this.currentSource) {
      this.currentSource.stop();
      this.currentSource = undefined;
    }
  }

  // 🕯️ Easter Egg - Bougie Décorative
  toggleEasterEggMusic() {
    this.easterEggActivated = !this.easterEggActivated;

    if (this.easterEggActivated) {
      this.playEasterEggMusic();
    } else {
      this.stopEasterEggMusic();
    }
  }

  private playEasterEggMusic() {
    // Créer l'élément audio s'il n'existe pas
    if (!this.easterEggAudio) {
      this.easterEggAudio = new Audio();
      this.easterEggAudio.src = '/assets/perceval-cheque-de-caution.mp3';
      this.easterEggAudio.loop = true; // Lecture en boucle
      this.easterEggAudio.volume = 0.5; // Volume à 50%
    }

    // Jouer la musique
    this.easterEggAudio.play().catch(error => {
      console.error('Erreur lors de la lecture de la musique:', error);
      this.easterEggActivated = false;
    });
  }

  private stopEasterEggMusic() {
    if (this.easterEggAudio) {
      this.easterEggAudio.pause();
      this.easterEggAudio.currentTime = 0; // Remettre au début
    }
  }

  ngOnDestroy() {
    this.stopMusic();
    this.stopEasterEggMusic();
    if (this.audioContext) {
      this.audioContext.close();
    }
  }
}
