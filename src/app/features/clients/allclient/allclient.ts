import { ChangeDetectionStrategy, Component, input, output } from '@angular/core';
import { RouterLink } from '@angular/router';

import type { Client } from '../data/client.types';

@Component({
  selector: 'app-allclient',
  imports: [RouterLink],
  templateUrl: './allclient.html',
  styleUrl: './allclient.css',
})
export class Allclient {
  readonly clients = input.required<Client[]>();
  readonly canManage = input(false);
  readonly canDelete = input(false);

  readonly edit = output<Client>();
  readonly remove = output<Client>();

}
