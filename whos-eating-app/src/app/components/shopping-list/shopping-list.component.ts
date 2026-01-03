import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';
import { ThemeService } from '../../services/theme.service';
import { Subscription } from 'rxjs';

export interface ShoppingItem {
  id: number;
  name: string;
  checked: boolean;
  showMagicStars?: boolean;
  fadingOut?: boolean;
  randomStarPositions?: {top: number, left: number}[];
}

@Component({
  selector: 'app-shopping-list',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './shopping-list.component.html',
  styleUrl: './shopping-list.component.css',
  animations: [
    trigger('itemAnimation', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateX(-20px)' }),
        animate('300ms ease-out', style({ opacity: 1, transform: 'translateX(0)' }))
      ]),
      transition('* => *', [
        animate('500ms ease-in-out')
      ])
    ])
  ]
})
export class ShoppingListComponent implements OnDestroy {
  newItem: string = '';
  shoppingItems: ShoppingItem[] = [];
  private nextId: number = 1;
  showConfirmModal: boolean = false;
  darkMode: boolean = false;
  showBlueTornado: boolean = false;
  showGlobalMagicStars: boolean = false;
  globalStarPositions: {top: number, left: number}[] = [];
  private themeSubscription?: Subscription;

  constructor(private themeService: ThemeService) {
    // S'abonner au mode nuit du service
    this.themeSubscription = this.themeService.nightMode$.subscribe(isNightMode => {
      this.darkMode = isNightMode;
    });
  }

  addItem(): void {
    if (this.newItem.trim()) {
      const item: ShoppingItem = {
        id: this.nextId++,
        name: this.newItem.trim(),
        checked: false
      };
      this.shoppingItems.push(item);
      this.newItem = '';
    }
  }

  toggleItem(item: ShoppingItem): void {
    item.checked = !item.checked;
    // Attendre la fin de l'animation de barrage (1s) avant de déplacer l'item
    setTimeout(() => {
      this.sortItems();
    }, 1000);
  }

  private sortItems(): void {
    this.shoppingItems.sort((a, b) => {
      // Les articles non cochés (false) passent avant les cochés (true)
      if (a.checked === b.checked) {
        return 0; // Garde l'ordre actuel si même statut
      }
      return a.checked ? 1 : -1; // Non cochés en premier
    });
  }

  deleteItem(id: number): void {
    // Trouver l'item pour déclencher l'animation magique
    const item = this.shoppingItems.find(i => i.id === id);
    if (item) {
      // Activer l'animation d'étoiles ET le fade out en même temps
      item.showMagicStars = true;
      item.fadingOut = true;

      // Attendre la fin des deux animations (2s) avant de supprimer définitivement
      setTimeout(() => {
        this.shoppingItems = this.shoppingItems.filter(i => i.id !== id);
      }, 2000);
    }
  }

  openConfirmModal(): void {
    this.showConfirmModal = true;
  }

  closeConfirmModal(): void {
    this.showConfirmModal = false;
  }

  confirmClearAllItems(): void {
    // Activer l'animation de tornade bleue
    this.showBlueTornado = true;

    // Générer 8 positions aléatoires pour l'animation globale
    this.globalStarPositions = this.generateRandomStarPositions();
    this.showGlobalMagicStars = true;

    // Déclencher uniquement le fade out pour tous les items (sans étoiles individuelles)
    this.shoppingItems.forEach(item => {
      item.fadingOut = true;
    });

    // Fermer la modale immédiatement pour voir les animations
    this.closeConfirmModal();

    // Attendre la fin de l'animation de tornade (4s) avant de tout supprimer
    setTimeout(() => {
      this.shoppingItems = [];
      this.showBlueTornado = false;
      this.showGlobalMagicStars = false;
    }, 4000);
  }

  private generateRandomStarPositions(): {top: number, left: number}[] {
    const positions = [];
    // Position centrale
    positions.push({ top: 50, left: 50 });

    // 7 positions aléatoires en périphérie
    for (let i = 0; i < 7; i++) {
      positions.push({
        top: Math.random() * 100,
        left: Math.random() * 100
      });
    }
    return positions;
  }

  get uncheckedCount(): number {
    return this.shoppingItems.filter(item => !item.checked).length;
  }

  trackByItemId(index: number, item: ShoppingItem): number {
    return item.id;
  }

  ngOnDestroy(): void {
    if (this.themeSubscription) {
      this.themeSubscription.unsubscribe();
    }
  }
}
