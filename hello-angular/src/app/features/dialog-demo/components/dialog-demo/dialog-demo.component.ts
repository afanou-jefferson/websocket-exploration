import { Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { GreetingDialogComponent } from '../greeting-dialog/greeting-dialog.component';
import { DialogDemoService } from '../../dialog-demo.service';

@Component({
  selector: 'app-dialog-demo',
  standalone: false,
  // Le service est déclaré dans les 'providers' du composant (Component-level scoping).
  // Cela crée une instance unique du service pour ce composant et ses futurs enfants.
  // Contrairement à 'providedIn: root', cette instance sera détruite quand le composant le sera
  providers: [DialogDemoService],
  template: `
    <div class="dialog-demo-container">
      <h2>MatDialog + Service Signal Demo</h2>

      <p class="subtitle">
        Open the dialog and type a value — it will update the signal below in real time,
        because the dialog receives the <strong>same service instance</strong> via
        <code>MAT_DIALOG_DATA</code>.
      </p>

      <div class="signal-box">
        <span class="signal-label">service.value()</span>
        <span class="signal-value">{{ service.value() || '(empty — open the dialog)' }}</span>
      </div>

      <button mat-raised-button color="primary" (click)="openDialog()">
        Open Dialog
      </button>
    </div>
  `,
  styleUrls: ['./dialog-demo.component.scss']
})
export class DialogDemoComponent {
  protected service = inject(DialogDemoService);
  private dialog = inject(MatDialog);

  openDialog(): void {
    // Dans cette version d'Angular Material (20 chez toi normalement), 'MatDialogConfig' ne dispose pas de l'option 'providers'.
    // C'était en preview/expérimental en v17 c'est pour ça que copilot a "menti" tout à l'heure
    // La solution c'est de passer l'instance du service elle-même dans l'objet 'data'.
    // Ainsi, la modale et ce composant partagent la même référence d'objet en mémoire ( le bean/service en java en quelque sorte )
    // Ca semble un peu dirty mais c'est le plus simple pour l'instant
    this.dialog.open(GreetingDialogComponent, {
      width: '420px',
      data: this.service
    });
  }
}
