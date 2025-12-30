import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Participant {
  name: string;
  isGuest: boolean;
  addedBy?: string;
}

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

  ngOnInit() {
    // Charger les données du localStorage
    const saved = localStorage.getItem('lunchParticipants');
    if (saved) {
      const data = JSON.parse(saved);
      // Vérifier si les données sont du jour actuel
      const today = new Date().toDateString();
      if (data.date === today) {
        this.participants = data.participants;
      } else {
        // Nouveau jour, réinitialiser
        this.resetDay();
      }
    }
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
      this.participants.push({
        name: member,
        isGuest: false
      });
      this.selectedMember = '';
      this.saveData();
    }
  }

  removeMember(member: string) {
    // Retirer le membre et tous ses invités
    this.participants = this.participants.filter(
      p => !(p.name === member && !p.isGuest) && p.addedBy !== member
    );
    this.saveData();
  }

  addGuest(addedBy: string) {
    if (this.guestName.trim() && addedBy) {
      this.participants.push({
        name: this.guestName.trim(),
        isGuest: true,
        addedBy: addedBy
      });
      this.guestName = '';
      this.showGuestForm = false;
      this.selectedMember = '';
      this.saveData();
    }
  }

  removeParticipant(participant: Participant) {
    const index = this.participants.indexOf(participant);
    if (index > -1) {
      this.participants.splice(index, 1);
      this.saveData();
    }
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

  saveData() {
    const data = {
      date: new Date().toDateString(),
      participants: this.participants
    };
    localStorage.setItem('lunchParticipants', JSON.stringify(data));
  }

  resetDay() {
    this.participants = [];
    this.saveData();
  }
}
