import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { ProcessService, ProcessWithClickedButton } from '../services/process.service';
import { ButtonSelected } from '../credentials/credentials.component';
import { Step } from '../models/Process';
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

  /*
   * Generate array of paths from all the process steps and the targeted steps
   */
  ngOnInit(): void {
    this.subscriptions.push(
      this.processService.processSubject$.subscribe(
        (processData: ProcessWithClickedButton) => {
           // If the process is empty or the button that was clicked is not GET_PARENT_STEP_LIST return
          if (
            Object.keys(processData).length === 0 ||
            processData.button !== ButtonSelected.GET_PARENT_STEP_LIST
          ) return;

          // Get all steps with asterisks from the subject
          this.processService.stepsWithAsterickSubject$.subscribe(
            (targetedSteps: Step[]) => {
              // Reset step list
              this.stepList = []; 

              targetedSteps.forEach((step: Step) => {
                let currentPath: string[] = [];
                // Generate array of paths from all the process steps and the targeted steps
                currentPath = this.findParentSteps(
                  processData.process.steps,
                  step.id
                ).reverse();
                // Add NULL to the end of the path
                currentPath.push('NULL');
                this.stepList.push(currentPath);
              });
            }
          );
        }
      )
    );
  }

  /**
   * Recursively search through a list of steps to find the parent steps of a target step
   * 
   * @param steps - List of all steps
   * @param targetId - ID of the target step
   * @param currentPath - Default empty at start, it is used to save the id/name of a step
   * @returns - The path from the target step to the root step
   */
  private findParentSteps(
    steps: Step[],
    targetId: string,
    currentPath: string[] = []
  ): string[] {
    for (const step of steps) {
      // Add the steps name or ID to the current path
      if (step.id === targetId) {
        currentPath.push(step.stepName ?? step.id);
        return currentPath;
      }

       // Check if the current step has children steps
      if ('children' in step && step.children.length > 0) {
        // Create a new path including the current step's name or ID
        const newPath = [...currentPath, step.stepName ?? step.id];
        // Recursively search the children steps
        const path = this.findParentSteps(step.children, targetId, newPath);
        // Return a valid path if one was found
        if (path.length > 0) {
          return path;
        }
      }
    }
    return [];
  }

   /*
   * OnDestroy remove all subscriptions
   */
  ngOnDestroy(): void {
    this.subscriptions.forEach((sub: Subscription) => sub.unsubscribe());
  }
}
