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
  }

  deleteItem(id: number): void {
    this.shoppingItems = this.shoppingItems.filter(item => item.id !== id);
  }

  clearCheckedItems(): void {
    this.shoppingItems = this.shoppingItems.filter(item => !item.checked);
  }

  get uncheckedCount(): number {
    return this.shoppingItems.filter(item => !item.checked).length;
  }

  get allItemsUnchecked(): boolean {
    return this.shoppingItems.every(item => !item.checked);
  }
}
