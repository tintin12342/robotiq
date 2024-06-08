import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';

const ELEMENT_DATA: any[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
];

@Component({
  selector: 'app-variable-occurence-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCardModule],
  templateUrl: './variable-occurence-table.component.html',
  styleUrl: './variable-occurence-table.component.scss',
})
export class VariableOccurenceTableComponent {
  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = ELEMENT_DATA;
}
