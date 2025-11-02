import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Header } from './layout/header/header';
import { Footer } from './layout/footer/footer';
import { electrofyStore } from './electrofy-store';
import { Aichatbot } from './components/aichatbot/aichatbot';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, Aichatbot],
  template: `
    <div class="flex flex-col min-h-screen">
      <app-header class="z-10 relative sticky top-0"></app-header>
      <div class="flex-1 overflow-auto">
        <app-aichatbot></app-aichatbot>
        <router-outlet />
      </div>
      <app-footer></app-footer>
    </div>
  `,
  styles: [],
})
export class App implements OnInit {
  private store = inject(electrofyStore);

  async ngOnInit() {
    // Initialize store - load products, cart, wishlist
    await this.store.initialize();
  }
}
