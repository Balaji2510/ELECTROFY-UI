import { Component, input, output, signal } from '@angular/core';
import { MatIconButton } from '@angular/material/button';
import { MatIcon } from '@angular/material/icon';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-quantity-selector',
  imports: [MatIconButton, MatIcon, CommonModule],
  template: `
    <div class="flex items-center gap-2 border border-gray-300 rounded-lg">
      <button 
        matIconButton
        [disabled]="quantity() <= min()"
        (click)="decrease()"
        class="!w-8 !h-8"
        aria-label="Decrease quantity"
      >
        <mat-icon class="text-sm">remove</mat-icon>
      </button>
      <span class="min-w-[3rem] text-center font-semibold text-gray-900">
        {{ quantity() }}
      </span>
      <button 
        matIconButton
        [disabled]="quantity() >= max()"
        (click)="increase()"
        class="!w-8 !h-8"
        aria-label="Increase quantity"
      >
        <mat-icon class="text-sm">add</mat-icon>
      </button>
    </div>
  `,
  styles: ``
})
export class QuantitySelectorComponent {
  quantity = input.required<number>();
  min = input<number>(1);
  max = input<number>(99);
  
  quantityChange = output<number>();

  increase() {
    const newQuantity = Math.min(this.quantity() + 1, this.max());
    this.quantityChange.emit(newQuantity);

  }

  decrease() {
    const newQuantity = Math.max(this.quantity() - 1, this.min());
    this.quantityChange.emit(newQuantity);
  }

  private updateQuantity(value: number) {
    this.quantityChange.emit(value);
  }

}