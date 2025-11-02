import { Component, input } from '@angular/core';
import { OrderItem } from '../../models/order';

@Component({
  selector: 'app-order-items-list',
  imports: [],
  template: `
    <div class="space-y-4">
      @for (item of items(); track item._id || item.product._id) {
        <div class="flex gap-4 p-4 bg-gray-50 rounded-lg">
          <!-- Product Image -->
          <img
            [src]="item.image || item.product.images?.[0] || '/assets/placeholder.jpg'"
            [alt]="item.productName"
            class="w-20 h-20 object-cover rounded border border-gray-200"
          >
          
          <!-- Product Details -->
          <div class="flex-1">
            <h4 class="font-semibold text-gray-900 mb-1">
              {{ item.productName }}
            </h4>
            @if (item.variantAttributes && getVariantAttributeKeys(item.variantAttributes).length > 0) {
              <div class="text-sm text-gray-600 mb-2">
                @for (attr of getVariantAttributes(item.variantAttributes); track attr.key) {
                  <span>{{ attr.key }}: {{ attr.value }}</span>
                  @if (!$last) {
                    <span class="mx-2">•</span>
                  }
                }
              </div>
            }
            <p class="text-sm text-gray-500">SKU: {{ item.sku }}</p>
            <p class="text-sm text-gray-600 mt-2">
              Quantity: <span class="font-medium">{{ item.quantity }}</span>
            </p>
          </div>
          
          <!-- Price -->
          <div class="text-right">
            <p class="font-semibold text-gray-900">
              &#8377;{{ item.unitPrice.toLocaleString('en-IN') }}
            </p>
            <p class="text-sm text-gray-600 mt-1">
              Total: &#8377;{{ item.totalPrice.toLocaleString('en-IN') }}
            </p>
          </div>
        </div>
      }
    </div>
  `
})
export class OrderItemsList {
  items = input.required<OrderItem[]>();

  getVariantAttributes(attrs: Record<string, string>): Array<{ key: string; value: string }> {
    return Object.entries(attrs).map(([key, value]) => ({ key, value }));
  }

  getVariantAttributeKeys(attrs: Record<string, string>): string[] {
    return Object.keys(attrs);
  }
}
