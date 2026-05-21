import { Component, signal ,inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AuthStore } from './core/store/auth.store';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('front-recouvra');
    private readonly authStore = inject(AuthStore);

  constructor() {
    this.authStore.init().subscribe();

}
}
