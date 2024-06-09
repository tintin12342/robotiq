import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Process } from '../models/Process';
import { API } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProcessService {
  getVariablesSubject$ = new BehaviorSubject<Process>({} as Process);
  getVariableOccurenceSubject$ = new BehaviorSubject<Process>({} as Process);
  getParentStepListSubject$ = new BehaviorSubject<Process>({} as Process);

  private http = inject(HttpClient);

  getProcess(username: string, password: string): Observable<Process> {
    const base64Credentials = btoa(`${username}:${password}`);
    const headers = new HttpHeaders({
      Authorization: `Basic ${base64Credentials}`,
    });

    return this.http.get<Process>(`${API.url}`, { headers });
  }
}
