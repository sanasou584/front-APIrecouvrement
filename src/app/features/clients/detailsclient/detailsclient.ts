import { ChangeDetectionStrategy, Component, effect, inject, input } from '@angular/core';
import { RouterLink } from '@angular/router';

import { ClientStore } from '../data/client.store';

@Component({
  selector: 'app-detailsclient',
  imports: [RouterLink],
  providers: [ClientStore],
  templateUrl: './detailsclient.html',
  styleUrl: './detailsclient.css',
})
export class Detailsclient {
  readonly id = input.required<string>();
  readonly store = inject(ClientStore);

  constructor() {
    effect(() => {
      this.store.loadById(this.id());
    });
  }
}

