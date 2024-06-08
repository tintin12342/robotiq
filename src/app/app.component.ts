import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { MatGridListModule } from '@angular/material/grid-list';
import { CredentialsComponent } from './credentials/credentials.component';
import { CallButtonsComponent } from './call-buttons/call-buttons.component';
import { ParentStepListComponent } from './parent-step-list/parent-step-list.component';
import { VariableListComponent } from './variable-list/variable-list.component';
import { VariableOccurenceTableComponent } from './variable-occurence-table/variable-occurence-table.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    MatGridListModule,
    CredentialsComponent,
    CallButtonsComponent,
    ParentStepListComponent,
    VariableListComponent,
    VariableOccurenceTableComponent,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {}
