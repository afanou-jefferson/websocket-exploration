import { Component } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule, FormControl } from '@angular/forms';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-city-search',
  standalone: true,
  imports: [CommonModule, AsyncPipe, MatAutocompleteModule, MatInputModule, MatFormFieldModule, ReactiveFormsModule],
  template: `
    <mat-form-field>
      <input
        matInput
        [formControl]="searchCtrl"
        [matAutocomplete]="auto"
        placeholder="Search city"
        data-testid="city-input"
      />
      <mat-autocomplete #auto="matAutocomplete" data-testid="autocomplete-panel">
        @for (city of filteredCities$ | async; track city) {
          <mat-option [value]="city" [attr.data-testid]="'option-' + city">
            {{ city }}
          </mat-option>
        }
      </mat-autocomplete>
    </mat-form-field>
  `,
})
export class CitySearchComponent {
  readonly cities = ['Amsterdam', 'Berlin', 'Copenhagen', 'Dublin', 'Edinburgh'];

  searchCtrl = new FormControl('');

  filteredCities$ = this.searchCtrl.valueChanges.pipe(
    startWith(''),
    map(query => {
      const q = (query ?? '').toLowerCase();
      return this.cities.filter(c => c.toLowerCase().includes(q));
    }),
  );
}
