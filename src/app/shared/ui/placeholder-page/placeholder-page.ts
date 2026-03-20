import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
import { toSignal } from '@angular/core/rxjs-interop';


@Component({
  selector: 'app-placeholder-page',
  imports: [],
  templateUrl: './placeholder-page.html',
  styleUrl: './placeholder-page.css',
})
export class PlaceholderPage {
  private readonly route = inject(ActivatedRoute);

  readonly title = toSignal(this.route.data.pipe(map((data) => (data['title'] as string) ?? 'Module')),
    { initialValue: 'Module' });

  readonly description = toSignal(
    this.route.data.pipe(map((data) => (data['description'] as string) ?? 'Zone en attente du branchement métier.')),
    { initialValue: 'Zone en attente du branchement métier.' }
  );


}
