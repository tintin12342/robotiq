import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { Process } from '../models/Process';
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

  private http = inject(HttpClient);

  getProcess(username: string, password: string): Observable<Process> {
    const base64Credentials = btoa(`${username}:${password}`);
    const headers = new HttpHeaders({
      Authorization: `Basic ${base64Credentials}`,
    });

    return this.http.get<Process>(`${API.url}`, { headers });
  }
}
