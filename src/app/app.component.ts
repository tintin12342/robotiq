import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { CredentialsComponent } from './credentials/credentials.component';
import { ParentStepListComponent } from './parent-step-list/parent-step-list.component';
import { VariableListComponent } from './variable-list/variable-list.component';
import { VariableOccurenceTableComponent } from './variable-occurence-table/variable-occurence-table.component';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    CredentialsComponent,
    ParentStepListComponent,
    VariableListComponent,
    VariableOccurenceTableComponent,
    MatDividerModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
