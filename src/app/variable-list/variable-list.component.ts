import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { ProcessService } from '../services/process.service';
import { Process } from '../models/Process';
import { ButtonSelected } from '../credentials/credentials.component';
import { BehaviorSubject, Subscription } from 'rxjs';

@Component({
  selector: 'app-variable-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatListModule],
  templateUrl: './variable-list.component.html',
  styleUrl: './variable-list.component.scss',
})
export class VariableListComponent implements OnInit, OnDestroy {
  processService = inject(ProcessService);
  pricessSubscription: Subscription = new Subscription();
  process$: BehaviorSubject<{ process: Process; button: ButtonSelected }> = this.processService.processSubject$;
  defineVariableStepsSubject$: BehaviorSubject<string[]> = this.processService.defineVariableStepsSubject$;

  ngOnInit(): void {
    this.pricessSubscription = this.processService.processSubject$.subscribe(
      (processData: { process: Process; button: ButtonSelected }) => {
        if (processData.button !== ButtonSelected.GET_VARIABLES) return;

        this.processService.defineVariableStepsSubject$.next(
          this.processService.findVariables(processData.process.steps)
        );
      }
    );
  }

  ngOnDestroy(): void {
    this.pricessSubscription.unsubscribe();
  }
}
