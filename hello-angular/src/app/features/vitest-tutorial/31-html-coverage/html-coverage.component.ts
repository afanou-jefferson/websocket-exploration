import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-html-coverage',
  standalone: true,
  templateUrl: './html-coverage.component.html',
})
export class HtmlCoverageComponent {
  title = signal('HTML Coverage Test');
  isVisible = signal(true);

  toggleVisibility() {
    this.isVisible.update((v) => !v);
  }
}
