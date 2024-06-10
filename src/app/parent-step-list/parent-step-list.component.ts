import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { ProcessService } from '../services/process.service';
import { ButtonSelected } from '../credentials/credentials.component';
import { Process, Step } from '../models/Process';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-parent-step-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatListModule],
  templateUrl: './parent-step-list.component.html',
  styleUrl: './parent-step-list.component.scss',
})
export class ParentStepListComponent implements OnInit {
  processService = inject(ProcessService);
  subscriptions: Subscription[] = [];
  stepList: string[][] = [];

  ngOnInit(): void {
    this.subscriptions.push(
      this.processService.processSubject$.subscribe(
        (processData: { process: Process; button: ButtonSelected }) => {
          if (
            Object.keys(processData).length === 0 ||
            processData.button !== ButtonSelected.GET_PARENT_STEP_LIST
          )
            return;

          this.processService.stepsWithAsterickSubject$.subscribe(
            (targetedSteps: Step[]) => {
              targetedSteps.forEach((step: Step) => {
                let currentPath: string[] = [];
                currentPath = this.findParentSteps(
                  processData.process.steps,
                  step.id
                ).reverse();
                currentPath.push('NULL');
                this.stepList.push(currentPath);
              });
            }
          );
        }
      )
    );
  }

  private findParentSteps(
    steps: Step[],
    targetId: string,
    currentPath: string[] = []
  ): string[] {
    for (const step of steps) {
      if (step.id === targetId) {
        currentPath.push(step.stepName ?? step.id);
        return currentPath;
      }

      if ('children' in step && step.children.length > 0) {
        const newPath = [...currentPath, step.stepName ?? step.id];
        const path = this.findParentSteps(step.children, targetId, newPath);
        if (path.length > 0) {
          return path;
        }
      }
    }
    return [];
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((subscription: Subscription) => subscription.unsubscribe());
  }
}
