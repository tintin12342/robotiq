import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import {
  Step,
  StepType,
  StringInputStep,
} from '../models/Process';
import { ButtonSelected } from '../credentials/credentials.component';
import { ProcessService, ProcessWithClickedButton } from '../services/process.service';
import { Subscription } from 'rxjs';

/*
 * Interface for table
 */
interface StepDataSource {
  title: string;
  names: string[];
}

@Component({
  selector: 'app-variable-occurrence-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCardModule],
  templateUrl: './variable-occurrence-table.component.html',
  styleUrl: './variable-occurrence-table.component.scss',
})
export class VariableOccurrenceTableComponent implements OnInit, OnDestroy {
  processService = inject(ProcessService);

  processSubscription: Subscription = new Subscription();
  displayedColumns: string[] = ['title', 'names'];
  dataSource: StepDataSource[] = [];

  ngOnInit(): void {
    this.processSubscription = this.processService.processSubject$.subscribe(
      (processData: ProcessWithClickedButton) => {
        if (Object.keys(processData).length === 0 || processData.button === ButtonSelected.GET_VARIABLES) return;
        
        // If get variable occurrence is pressed first the variables list above must be filled
        this.processService.variableStepsSubject$.next(
          this.processService.findVariables(processData.process.steps)
        );

        // Initialize arrays to store steps with asterisks and their IDs
        const stepsWithAsterisk: Step[] = [];
        const idsOfStepsWithAsterisk: string[] = [];

        // Find steps with asterisks recursively and populate the arrays
        this.findStepsWithAsterisk(processData.process.steps, stepsWithAsterisk, idsOfStepsWithAsterisk);

        // Create a variable map based on the steps with asterisks and their IDs
        const stepsData = this.createVariableMap(stepsWithAsterisk, idsOfStepsWithAsterisk);

        // Refactor the data source based on the generated steps data
        this.refactorDataSource(stepsData);

        this.processService.stepsWithAsterickSubject$.next(stepsWithAsterisk);
      }
    );
  }

  /**
   * Find all steps with asterisks
   * 
   * @param steps - All steps
   * @param stepsWithAsterisk - All steps with asterisks
   * @param idsOfStepsWithAsterisks - IDs of all steps with asterisks
   */
  private findStepsWithAsterisk(steps: Step[], stepsWithAsterisk: Step[], idsOfStepsWithAsteriks: string[]) {
    const asteriskRegex = /\*/;

    // Recursively search through children and add steps with asterisks to stepsWithAsterisk
    for (const step of steps) {
      if (step.stepType === StepType.StringInputStep) {
        const stringStep = step;
        if (asteriskRegex.test(stringStep.value)) {
          stepsWithAsterisk.push(step);
          idsOfStepsWithAsteriks.push(step.id);
        }
      } else if ('children' in step) {
        this.findStepsWithAsterisk(step.children, stepsWithAsterisk, idsOfStepsWithAsteriks);
      }
    }
  }

  /**
   * Creates a map of variable names to their corresponding step names
   * 
   * @param steps - All steps with asterisks
   * @param stepIds - IDs of all steps with asterisks
   * @returns - Array of StepDataSource
   */
  private createVariableMap(steps: Step[], stepIds: string[]): StepDataSource[] {
    const map: { [key: string]: string[] } = {};

    // Iterate through each step, add name/ID to the map and remove asterisks
    steps.forEach((step) => {
      if (stepIds.includes(step.id)) {
        const value = (step as StringInputStep).value.replace(/\*/g, '');
        if (!map[value]) {
          map[value] = [];
        }
        map[value].push(step.stepName ?? step.id);
      }
    });

    // Remove ·g from titles
    return Object.entries(map).map(([title, names]) => ({
      title: title.endsWith('·g') ? title.slice(0, -2) : title,
      names,
    }));
  }

  /** 
   * Refactor the data source for mat-table
   * 
   * @param stepsData - List of all titles and their names
   */
  private refactorDataSource(stepsData: StepDataSource[]) {
    if (stepsData.length === 0) return;

    // Extract titles
    this.displayedColumns = stepsData.map(item => item.title);

    // Determine the maximum number of names for any title
    const maxNames = Math.max(...stepsData.map(item => item.names.length));

    // Create rows
    this.dataSource = Array.from({ length: maxNames }, (_, rowIndex) => {
      const row: any = {};
      this.displayedColumns.forEach(title => {
        const variable = stepsData.find(item => item.title === title);
        row[title] = variable?.names[rowIndex] || '';
      });
      return row;
    });
  }

  /*
   * OnDestroy remove pricess subscription
   */
  ngOnDestroy(): void {
    this.processSubscription.unsubscribe();
  }
}
