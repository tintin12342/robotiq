import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';

@Component({
  selector: 'app-parent-step-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatListModule],
  templateUrl: './parent-step-list.component.html',
  styleUrl: './parent-step-list.component.scss'
})
export class ParentStepListComponent {

}
