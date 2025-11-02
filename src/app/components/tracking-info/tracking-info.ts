import { Component, input } from '@angular/core';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-tracking-info',
  imports: [MatIcon],
  template: `
    @if (trackingNumber()) {
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div class="flex items-start gap-3">
          <mat-icon class="text-blue-600">local_shipping</mat-icon>
          <div class="flex-1">
            <h4 class="font-semibold text-gray-900 mb-1">Tracking Information</h4>
            <p class="text-sm text-gray-600 mb-2">
              Track your package with the tracking number below:
            </p>
            <div class="flex items-center gap-2">
              <code class="bg-white px-3 py-1 rounded border border-blue-200 text-sm font-mono">
                {{ trackingNumber() }}
              </code>
              <button
                matButton="outlined"
                (click)="copyTrackingNumber()"
                class="!text-sm"
              >
                <mat-icon class="!text-base">content_copy</mat-icon>
                Copy
              </button>
            </div>
            @if (shippingMethod()) {
              <p class="text-sm text-gray-600 mt-2">
                Shipping Method: <span class="font-medium">{{ shippingMethod() }}</span>
              </p>
            }
          </div>
        </div>
      </div>
    } @else {
      <div class="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
        <mat-icon class="text-gray-400 mb-2">local_shipping</mat-icon>
        <p class="text-sm text-gray-600">Tracking information will be available once your order is shipped</p>
      </div>
    }
  `
})
export class TrackingInfo {
  trackingNumber = input<string | undefined>('');
  shippingMethod = input<string | undefined>('');

  copyTrackingNumber() {
    const tracking = this.trackingNumber();
    if (tracking) {
      navigator.clipboard.writeText(tracking).then(() => {
        // Could show a toast notification here
      });
    }
  }
}

