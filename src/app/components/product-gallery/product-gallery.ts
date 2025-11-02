import { Component, input, signal, computed } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-product-gallery',
  imports: [MatIcon],
  template: `
    <div class="relative">
      <!-- Main Image -->
      <div class="relative bg-gray-100 rounded-lg overflow-hidden aspect-square mb-4">
        <img 
          [src]="selectedImage()" 
          [alt]="productName()"
          class="w-full h-full object-cover transition-opacity duration-300"
          loading="lazy"
        >
        <!-- Navigation Buttons (Desktop) -->
        @if (images().length > 1) {
          <button
            matIconButton
            (click)="previousImage()"
            [disabled]="selectedIndex() === 0"
            class="absolute left-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-md !z-10"
            aria-label="Previous image"
          >
            <mat-icon>chevron_left</mat-icon>
          </button>
          <button
            matIconButton
            (click)="nextImage()"
            [disabled]="selectedIndex() === images().length - 1"
            class="absolute right-2 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white shadow-md !z-10"
            aria-label="Next image"
          >
            <mat-icon>chevron_right</mat-icon>
          </button>
        }
      </div>

      <!-- Thumbnail Gallery -->
      @if (images().length > 1) {
        <div class="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          @for (image of images(); track $index) {
            <button
              (click)="selectImage($index)"
              [class.border-2]="selectedIndex() === $index"
              [class.border-blue-500]="selectedIndex() === $index"
              [class.border-gray-200]="selectedIndex() !== $index"
              class="flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border transition-all hover:opacity-80"
            >
              <img 
                [src]="image" 
                [alt]="productName() + ' thumbnail ' + ($index + 1)"
                class="w-full h-full object-cover"
                loading="lazy"
              >
            </button>
          }
        </div>
      }
    </div>
  `,
  styles: `
    .scrollbar-hide {
      -ms-overflow-style: none;
      scrollbar-width: none;
    }
    .scrollbar-hide::-webkit-scrollbar {
      display: none;
    }
  `
})
export class ProductGallery {
  images = input<string[]>([]);
  productName = input<string>('');
  
  selectedIndex = signal(0);
  
  selectedImage = computed(() => {
    const imgs = this.images();
    const idx = this.selectedIndex();
    return imgs.length > 0 ? imgs[idx] : '';
  });

  selectImage(index: number) {
    this.selectedIndex.set(index);
  }

  nextImage() {
    const max = this.images().length - 1;
    if (this.selectedIndex() < max) {
      this.selectedIndex.update(idx => idx + 1);
    }
  }

  previousImage() {
    if (this.selectedIndex() > 0) {
      this.selectedIndex.update(idx => idx - 1);
    }
  }
}

