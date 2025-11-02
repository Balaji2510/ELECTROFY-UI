import { Component, input, output, signal, computed } from '@angular/core';

export interface ProductVariant {
  _id?: string;
  id?: string;
  sku: string;
  name?: string;
  attributes: Record<string, string>;
  price: number;
  compareAtPrice?: number;
  image?: string;
  isDefault: boolean;
  isActive: boolean;
}

@Component({
  selector: 'app-variant-selector',
  imports: [],
  template: `
    @if (variants().length > 0) {
      <div class="space-y-4">
        @for (attrGroup of attributeGroups(); track attrGroup.key) {
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              {{ attrGroup.label }}:
            </label>
            <div class="flex flex-wrap gap-2">
              @for (value of attrGroup.values; track value) {
                <button
                  type="button"
                  (click)="selectAttribute(attrGroup.key, value)"
                  [class.bg-blue-500]="selectedAttributes()[attrGroup.key] === value"
                  [class.text-white]="selectedAttributes()[attrGroup.key] === value"
                  [class.bg-gray-100]="selectedAttributes()[attrGroup.key] !== value"
                  [class.text-gray-700]="selectedAttributes()[attrGroup.key] !== value"
                  [class.border-blue-500]="selectedAttributes()[attrGroup.key] === value"
                  [disabled]="!isVariantAvailable(attrGroup.key, value)"
                  class="px-4 py-2 rounded-md border-2 border-transparent font-medium transition-all hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {{ value }}
                </button>
              }
            </div>
          </div>
        }
        @if (selectedVariant()) {
          <div class="mt-4 p-3 bg-blue-50 rounded-lg">
            <p class="text-sm text-gray-600">
              Selected: <span class="font-semibold">{{ selectedVariant()!.name || getSelectedVariantName() }}</span>
            </p>
            @if (selectedVariant()!.compareAtPrice && selectedVariant()!.compareAtPrice! > selectedVariant()!.price) {
              <div class="flex items-center gap-2 mt-2">
                <span class="text-lg font-bold text-gray-900">
                  &#8377;{{ selectedVariant()!.price.toLocaleString('en-IN') }}
                </span>
                <span class="text-sm text-gray-500 line-through">
                  &#8377;{{ selectedVariant()!.compareAtPrice?.toLocaleString('en-IN') ?? '' }}
                </span>
              </div>
            } @else {
              <p class="text-lg font-bold text-gray-900 mt-2">
                &#8377;{{ selectedVariant()!.price.toLocaleString('en-IN') }}
              </p>
            }
          </div>
        }
      </div>
    }
  `
})
export class VariantSelector {
  variants = input<ProductVariant[]>([]);
  selectedVariantChange = output<ProductVariant | null>();

  selectedAttributes = signal<Record<string, string>>({});

  attributeGroups = computed(() => {
    const variants = this.variants();
    if (variants.length === 0) return [];

    const groups = new Map<string, Set<string>>();
    
    variants.forEach(variant => {
      Object.entries(variant.attributes).forEach(([key, value]) => {
        if (!groups.has(key)) {
          groups.set(key, new Set());
        }
        groups.get(key)!.add(value);
      });
    });

    return Array.from(groups.entries()).map(([key, values]) => ({
      key,
      label: key.charAt(0).toUpperCase() + key.slice(1),
      values: Array.from(values)
    }));
  });

  selectedVariant = computed(() => {
    const selected = this.selectedAttributes();
    const variants = this.variants();
    
    if (Object.keys(selected).length === 0) {
      const defaultVariant = variants.find(v => v.isDefault && v.isActive);
      return defaultVariant || variants.find(v => v.isActive) || null;
    }

    return variants.find(variant => 
      variant.isActive &&
      Object.keys(selected).every(key => 
        variant.attributes[key] === selected[key]
      )
    ) || null;
  });

  selectAttribute(key: string, value: string) {
    this.selectedAttributes.update(attrs => ({
      ...attrs,
      [key]: value
    }));
    
    // Emit selected variant
    this.selectedVariantChange.emit(this.selectedVariant() || null);
  }

  isVariantAvailable(attrKey: string, attrValue: string): boolean {
    const currentSelection = { ...this.selectedAttributes(), [attrKey]: attrValue };
    return this.variants().some(variant => 
      variant.isActive &&
      Object.keys(currentSelection).every(key => 
        variant.attributes[key] === currentSelection[key]
      )
    );
  }

  getSelectedVariantName(): string {
    const selected = this.selectedAttributes();
    return Object.entries(selected)
      .map(([key, value]) => `${key}: ${value}`)
      .join(', ');
  }
}

