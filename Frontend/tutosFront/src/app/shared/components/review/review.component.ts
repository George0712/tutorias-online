import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-review',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="bg-gray-50 p-4 rounded-full">
      <div class="flex items-start gap-4">
        <div class="flex-shrink-0">
          <div class="w-12 h-12 rounded-full bg-[#A62639]/10 flex items-center justify-center">
            <i class="fa fa-user text-[#A62639]"></i>
          </div>
        </div>
        <div class="flex-1">
          <div class="flex justify-between items-start mb-2">
            <div>
              <h3 class="font-semibold text-gray-800">{{ name }}</h3>
              <div class="flex items-center text-yellow-400 text-sm">
                <i *ngFor="let star of [1,2,3,4,5]" 
                   class="fa fa-star"
                   [class.text-gray-300]="star > rating"></i>
              </div>
            </div>
            <span class="text-sm text-gray-500">{{ date }}</span>
          </div>
          <p class="text-gray-600">{{ comment }}</p>
        </div>
      </div>
    </div>
  `,
  styles: []
})
export class ReviewComponent {
  @Input() name: string = 'Nombre';
  @Input() rating: number = 5;
  @Input() date: string = '01/2025';
  @Input() comment: string = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.';
} 