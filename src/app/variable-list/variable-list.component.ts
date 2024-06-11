import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { ProcessService, ProcessWithClickedButton } from '../services/process.service';
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
  process$: BehaviorSubject<ProcessWithClickedButton> = this.processService.processSubject$;
  variableStepsSubject$: BehaviorSubject<string[]> = this.processService.variableStepsSubject$;

  /*
   * Find variables from the process steps and emit them to the subject
   */
  ngOnInit(): void {
    this.pricessSubscription = this.processService.processSubject$.subscribe(
      (processData: ProcessWithClickedButton) => {
        if (processData.button !== ButtonSelected.GET_VARIABLES) return;

        // From all process steps find variables and emit them to the subject
        this.processService.variableStepsSubject$.next(
          this.processService.findVariables(processData.process.steps)
        );
      }
    );
  }

  /*
   * OnDestroy remove pricess subscription
   */
  ngOnDestroy(): void {
    this.pricessSubscription.unsubscribe();
  }
}
