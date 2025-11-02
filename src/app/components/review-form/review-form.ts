import { Component, input, output, signal } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormField, MatLabel, MatError } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { MatButton } from '@angular/material/button';
import { StarRatingComponent } from '../star-rating/star-rating';
import { MatIcon } from '@angular/material/icon';

@Component({
  selector: 'app-review-form',
  imports: [
    ReactiveFormsModule,
    MatFormField,
    MatLabel,
    MatError,
    MatInput,
    MatButton,
    StarRatingComponent,
    MatIcon
  ],
  template: `
    <div class="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      <h3 class="text-xl font-bold text-gray-900 mb-4">Write a Review</h3>
      
      <form [formGroup]="reviewForm" (ngSubmit)="onSubmit()" class="space-y-4">
        <!-- Rating -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Rating <span class="text-red-500">*</span>
          </label>
          <div class="flex items-center gap-2">
            <app-star-rating 
              [rating]="selectedRating()" 
              [clickable]="true"
              (ratingChange)="onRatingChange($event)"
            />
            <span class="text-sm text-gray-600">
              @if (selectedRating() > 0) {
                {{ selectedRating() }} out of 5
              }
            </span>
          </div>
          @if (reviewForm.get('rating')?.invalid && reviewForm.get('rating')?.touched) {
            <p class="text-sm text-red-500 mt-1">Please select a rating</p>
          }
          <input type="hidden" formControlName="rating">
        </div>

        <!-- Title -->
        <mat-form-field>
          <mat-label>Review Title (Optional)</mat-label>
          <input matInput formControlName="title" placeholder="Summarize your experience">
        </mat-form-field>

        <!-- Comment -->
        <mat-form-field>
          <mat-label>Your Review <span class="text-red-500">*</span></mat-label>
          <textarea 
            matInput 
            formControlName="comment" 
            rows="5"
            placeholder="Share your experience with this product..."
          ></textarea>
          @if (reviewForm.get('comment')?.invalid && reviewForm.get('comment')?.touched) {
            <mat-error>Review comment is required</mat-error>
          }
        </mat-form-field>

        <!-- Image Upload (if needed) -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">
            Photos (Optional)
          </label>
          <input
            type="file"
            multiple
            accept="image/*"
            (change)="onImageSelect($event)"
            class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          >
          @if (selectedImages().length > 0) {
            <div class="flex gap-2 mt-2">
              @for (image of selectedImages(); track image) {
                <div class="relative">
                  <img [src]="image" alt="Preview" class="w-20 h-20 object-cover rounded">
                  <button
                    type="button"
                    matIconButton
                    (click)="removeImage(image)"
                    class="absolute -top-2 -right-2 !bg-red-500 !text-white !w-6 !h-6"
                  >
                    <mat-icon class="!text-sm">close</mat-icon>
                  </button>
                </div>
              }
            </div>
          }
        </div>

        <!-- Submit Button -->
        <div class="flex gap-3">
          <button
            matButton="filled"
            color="primary"
            type="submit"
            [disabled]="reviewForm.invalid || submitting()"
            class="flex-1"
          >
            @if (submitting()) {
              <span>Submitting...</span>
            } @else {
              <span>Submit Review</span>
            }
          </button>
          @if (showCancel()) {
            <button
              matButton="outlined"
              type="button"
              (click)="cancel.emit()"
            >
              Cancel
            </button>
          }
        </div>
      </form>
    </div>
  `
})
export class ReviewForm {
  productId = input.required<string>();
  showCancel = input<boolean>(false);
  
  submit = output<{
    rating: number;
    title?: string;
    comment: string;
    images?: string[];
  }>();
  cancel = output<void>();

  reviewForm: FormGroup;
  selectedRating = signal(0);
  selectedImages = signal<string[]>([]);
  submitting = signal(false);

  constructor(private fb: FormBuilder) {
    this.reviewForm = this.fb.group({
      rating: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
      title: [''],
      comment: ['', [Validators.required, Validators.minLength(10)]],
    });
  }

  onRatingChange(rating: number) {
    this.selectedRating.set(rating);
    this.reviewForm.patchValue({ rating });
  }

  onImageSelect(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      const files = Array.from(input.files);
      files.forEach(file => {
        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result as string;
          this.selectedImages.update(images => [...images, result]);
        };
        reader.readAsDataURL(file);
      });
    }
  }

  removeImage(image: string) {
    this.selectedImages.update(images => images.filter(img => img !== image));
  }

  onSubmit() {
    if (this.reviewForm.valid) {
      this.submitting.set(true);
      const formValue = this.reviewForm.value;
      
      this.submit.emit({
        rating: formValue.rating,
        title: formValue.title || undefined,
        comment: formValue.comment,
        images: this.selectedImages().length > 0 ? this.selectedImages() : undefined
      });
      
      // Reset form after a short delay (actual submission handled by parent)
      setTimeout(() => {
        this.reviewForm.reset();
        this.selectedRating.set(0);
        this.selectedImages.set([]);
        this.submitting.set(false);
      }, 1000);
    }
  }
}

