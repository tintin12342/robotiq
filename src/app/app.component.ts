import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CredentialsComponent } from './credentials/credentials.component';
import { ParentStepListComponent } from './parent-step-list/parent-step-list.component';
import { VariableListComponent } from './variable-list/variable-list.component';
import { MatDividerModule } from '@angular/material/divider';
import { VariableOccurrenceTableComponent } from './variable-occurrence-table/variable-occurrence-table.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CredentialsComponent,
    ParentStepListComponent,
    VariableListComponent,
    VariableOccurrenceTableComponent,
    MatDividerModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
