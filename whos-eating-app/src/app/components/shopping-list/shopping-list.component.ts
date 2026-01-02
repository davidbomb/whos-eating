import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { trigger, transition, style, animate } from '@angular/animations';

export interface ShoppingItem {
  id: number;
  name: string;
  checked: boolean;
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
export class ShoppingListComponent {
  newItem: string = '';
  shoppingItems: ShoppingItem[] = [];
  private nextId: number = 1;
  showConfirmModal: boolean = false;

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
    this.shoppingItems = this.shoppingItems.filter(item => item.id !== id);
  }

  openConfirmModal(): void {
    this.showConfirmModal = true;
  }

  closeConfirmModal(): void {
    this.showConfirmModal = false;
  }

  confirmClearAllItems(): void {
    this.shoppingItems = [];
    this.closeConfirmModal();
  }

  get uncheckedCount(): number {
    return this.shoppingItems.filter(item => !item.checked).length;
  }

  trackByItemId(index: number, item: ShoppingItem): number {
    return item.id;
  }
}
