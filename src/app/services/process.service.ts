import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  DefineVariableStep,
  Process,
  Step,
  StepType,
  StringInputStep,
} from '../models/Process';
import { API } from '../../environments/environment';
import { ButtonSelected } from '../credentials/credentials.component';

export interface ProcessWithClickedButton {
  process: Process;
  button: ButtonSelected;
}

@Injectable({
  providedIn: 'root',
})
export class ProcessService {
  private http = inject(HttpClient);

  processSubject$ = new BehaviorSubject<ProcessWithClickedButton>({} as ProcessWithClickedButton);
  variableStepsSubject$ = new BehaviorSubject<string[]>([]);
  stepsWithAsterickSubject$ = new BehaviorSubject<Step[]>([]);

  /*
   * Get process from API with credentials
   */
  getProcess(username: string, password: string): Observable<Process> {
    const base64Credentials = btoa(`${username}:${password}`);
    const headers = new HttpHeaders({
      Authorization: `Basic ${base64Credentials}`,
    });

    return this.http.get<Process>(`${API.url}`, { headers });
  }

  /**
   * Searches and returns a list of variables from all the steps
   * 
   * @param steps - List of all steps
   * @returns - List of variables from the steps
   */
  findVariables(steps: Step[]): string[] {
    let result: string[] = [];
    const asteriskRegex = /\u00B7/; // Regex to match the asterisk character

    steps.forEach((step) => {
      // Check if the step is a StringInputStep and if the value contains an asterisk and add it to result
      if (step.stepType === StepType.StringInputStep) {
        if (asteriskRegex.test(step.value)) {
          result.push((step as StringInputStep).value);
        }
      }

      // Check if the step is a DefineVariableStep and add it to result
      if (step.stepType === StepType.DefineVariableStep) {
        result.push((step as DefineVariableStep).variableName);
      }

      // Check if the step has children steps and recursively search through them
      if ('children' in step && step.children.length > 0) {
        result = result.concat(this.findVariables(step.children));
      }
    });

    // Remove asterisks from the result
    result = result.map((str) => str.replace(/\*/g, ''));
    // Remove 'g' from the result
    result = result.map((str) => (str.endsWith('g') ? str.slice(0, -2) : str));

    return result;
  }
}
