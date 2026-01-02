import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  styleUrl: './shopping-list.component.css'
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
    this.sortItems();
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

  confirmClearCheckedItems(): void {
    this.shoppingItems = this.shoppingItems.filter(item => !item.checked);
    this.closeConfirmModal();
  }

  get uncheckedCount(): number {
    return this.shoppingItems.filter(item => !item.checked).length;
  }

  get allItemsUnchecked(): boolean {
    return this.shoppingItems.every(item => !item.checked);
  }
}
