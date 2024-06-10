import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
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
export class VariableOccurenceTableComponent implements OnInit {
  processService = inject(ProcessService);
  displayedColumns: string[] = ['title', 'names'];
  dataSource: StepDataSource[] = [];

  ngOnInit(): void {
    this.processService.processSubject$.subscribe(
      (processData: { process: Process; button: ButtonSelected }) => {
        if (processData.button !== ButtonSelected.GET_VARIABLE_OCCURENCE) return;

        // If get variable occurence is pressed first the variables list above must be filled
        this.processService.defineVariableStepsSubject$.next(
          this.processService.findVariables(processData.process.steps)
        );

        // Find step references
        const stepsWithAsterisk: Step[] = [];
        const idsOfStepsWithAsterisk: string[] = [];

        this.findStepsWithAsterisk(processData.process.steps, stepsWithAsterisk, idsOfStepsWithAsterisk);

        const variableMap = this.createVariableMap(stepsWithAsterisk, idsOfStepsWithAsterisk);
        this.prepareDataSource(variableMap);
      }
    );
  }

  findStepsWithAsterisk(
    steps: Step[],
    stepsWithAsterisk: Step[],
    idsOfStepsWithAsteriks: string[]
  ) {
    const asteriskRegex = /\*/;

    for (const step of steps) {
      if (step.stepType === StepType.StringInputStep) {
        const stringStep = step;
        if (asteriskRegex.test(stringStep.value)) {
          stepsWithAsterisk.push(step);
          idsOfStepsWithAsteriks.push(step.id);
        }
      } else if ('children' in step) {
        this.findStepsWithAsterisk(
          step.children,
          stepsWithAsterisk,
          idsOfStepsWithAsteriks
        );
      }
    }
  }

  createVariableMap(
    steps: Step[],
    stepIds: string[]
  ): { title: string; names: string[] }[] {
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

  prepareDataSource(variableMap: { title: string; names: string[] }[]) {
    if (variableMap.length === 0) return;

    // Extract titles
    this.displayedColumns = variableMap.map(item => item.title);

    // Determine the maximum number of names for any title
    const maxNames = Math.max(...variableMap.map(item => item.names.length));

    // Create rows
    this.dataSource = Array.from({ length: maxNames }, (_, rowIndex) => {
      const row: any = {};
      this.displayedColumns.forEach(title => {
        const variable = variableMap.find(item => item.title === title);
        row[title] = variable?.names[rowIndex] || '';
      });
      return row;
    });
  }
}
