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

@Injectable({
  providedIn: 'root',
})
export class ProcessService {
  processSubject$ = new BehaviorSubject<{
    process: Process;
    button: ButtonSelected;
  }>({} as { process: Process; button: ButtonSelected });
  defineVariableStepsSubject$ = new BehaviorSubject<string[]>([]);
  stepsWithAsterickSubject$ = new BehaviorSubject<Step[]>([]);

  private http = inject(HttpClient);

  getProcess(username: string, password: string): Observable<Process> {
    const base64Credentials = btoa(`${username}:${password}`);
    const headers = new HttpHeaders({
      Authorization: `Basic ${base64Credentials}`,
    });

    return this.http.get<Process>(`${API.url}`, { headers });
  }

  findVariables(steps: Step[]): string[] {
    const asteriskRegex = /\u00B7/;

    let result: string[] = [];

    steps.forEach((step) => {
      if (step.stepType === StepType.StringInputStep) {
        if (asteriskRegex.test(step.value)) {
          result.push((step as StringInputStep).value);
        }
      }
      if (step.stepType === StepType.DefineVariableStep) {
        result.push((step as DefineVariableStep).variableName);
      }
      if ('children' in step && step.children.length > 0) {
        result = result.concat(this.findVariables(step.children));
      }
    });

    result = result.map((str) => str.replace(/\*/g, ''));
    result = result.map(str => str.endsWith('g') ? str.slice(0, -2) : str);

    return result;
  }
}
