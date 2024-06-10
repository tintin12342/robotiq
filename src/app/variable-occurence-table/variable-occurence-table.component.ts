import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import {
  DefineVariableStep,
  Process,
  Step,
  StepType,
  StringInputStep,
} from '../models/Process';
import { ButtonSelected } from '../credentials/credentials.component';
import { ProcessService } from '../services/process.service';
import { Subscription } from 'rxjs';

interface StepDataSource {
  title: string;
  names: string[];
}

@Component({
  selector: 'app-variable-occurence-table',
  standalone: true,
  imports: [CommonModule, MatTableModule, MatCardModule],
  templateUrl: './variable-occurence-table.component.html',
  styleUrl: './variable-occurence-table.component.scss',
})
export class VariableOccurenceTableComponent implements OnInit, OnDestroy {
  processService = inject(ProcessService);
  processSubscription: Subscription = new Subscription();
  displayedColumns: string[] = ['title', 'names'];
  dataSource: StepDataSource[] = [];

  ngOnInit(): void {
    this.processSubscription = this.processService.processSubject$.subscribe(
      (processData: { process: Process; button: ButtonSelected }) => {
        if (Object.keys(processData).length === 0 || processData.button === ButtonSelected.GET_VARIABLES) return;
        
        // If get variable occurence is pressed first the variables list above must be filled
        this.processService.defineVariableStepsSubject$.next(
          this.processService.findVariables(processData.process.steps)
        );

        // Find step references
        const stepsWithAsterisk: Step[] = [];
        const idsOfStepsWithAsterisk: string[] = [];

        this.findStepsWithAsterisk(processData.process.steps, stepsWithAsterisk, idsOfStepsWithAsterisk);

        const stepsData = this.createVariableMap(stepsWithAsterisk, idsOfStepsWithAsterisk);
        this.refactorDataSource(stepsData);

        this.processService.stepsWithAsterickSubject$.next(stepsWithAsterisk);
      }
    );
  }

  private findStepsWithAsterisk(steps: Step[], stepsWithAsterisk: Step[], idsOfStepsWithAsteriks: string[]) {
    const asteriskRegex = /\*/;

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

  private createVariableMap(steps: Step[], stepIds: string[]): StepDataSource[] {
    const map: { [key: string]: string[] } = {};

    steps.forEach((step) => {
      if (stepIds.includes(step.id)) {
        const value = (step as StringInputStep).value.replace(/\*/g, '');
        if (!map[value]) {
          map[value] = [];
        }
        map[value].push(step.stepName ?? step.id);
      }
    });

    return Object.entries(map).map(([title, names]) => ({
      title: title.endsWith('·g') ? title.slice(0, -2) : title,
      names,
    }));
  }

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

  ngOnDestroy(): void {
    this.processSubscription.unsubscribe();
  }
}
