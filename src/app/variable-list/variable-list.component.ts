import { CommonModule } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatListModule } from '@angular/material/list';
import { ProcessService } from '../services/process.service';
import { DefineVariableStep, Process, Step, StepType } from '../models/Process';
import { ButtonSelected } from '../credentials/credentials.component';

@Component({
  selector: 'app-variable-list',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatListModule],
  templateUrl: './variable-list.component.html',
  styleUrl: './variable-list.component.scss',
})
export class VariableListComponent implements OnInit {
  processService = inject(ProcessService);
  processName: string = '';
  defineVariableSteps: string[] = [];

  ngOnInit(): void {
    this.processService.processSubject$.subscribe(
      (processData: { process: Process; button: ButtonSelected }) => {
        if (processData.button !== ButtonSelected.GET_VARIABLES) return;
        
        this.processName = processData.process.robotiqProcessInfo.name;

        this.defineVariableSteps = this.findDefineVariableSteps(
          processData.process.steps
        );
      }
    );
  }

  findDefineVariableSteps(steps: Step[]): string[] {
    let result: string[] = [];

    steps.forEach((step) => {
      if (step.stepType === StepType.DefineVariableStep) {
        result.push((step as DefineVariableStep).variableName);
      }
      if ('children' in step && step.children.length > 0) {
        result = result.concat(this.findDefineVariableSteps(step.children));
      }
    });

    return result;
  }
}
