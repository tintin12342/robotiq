import { CommonModule } from '@angular/common';
import { Component, OnDestroy, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormGroupDirective,
  FormsModule,
  NgForm,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import {
  MatCheckboxChange,
  MatCheckboxModule,
} from '@angular/material/checkbox';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { ProcessService } from '../services/process.service';
import { DEFAULT_USER } from '../../environments/environment';
import { Process } from '../models/Process';
import { Subscription } from 'rxjs';

class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || (form && form.submitted))
    );
  }
}

export enum ButtonSelected {
  GET_VARIABLES = 'GET_VARIABLES',
  GET_VARIABLE_OCCURENCE = 'GET_VARIABLE_OCCURENCE',
  GET_PARENT_STEP_LIST = 'GET_PARENT_STEP_LIST',
}

@Component({
  selector: 'app-credentials',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatCheckboxModule,
    MatSnackBarModule,
    MatButtonModule,
    MatProgressBarModule,
  ],
  templateUrl: './credentials.component.html',
  styleUrl: './credentials.component.scss',
})
export class CredentialsComponent implements OnDestroy {
  private processService = inject(ProcessService);
  private snackBar = inject(MatSnackBar);
  private processSubscriptions: Subscription[] = [];
  matcher = new MyErrorStateMatcher();
  fetchingData: boolean = false;
  buttonSelected = ButtonSelected;
  clickedButton!: ButtonSelected;
  form: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', [Validators.required]),
    checkBox: new FormControl(''),
  });

  /*
   * Handles the change event of the checkbox.
   * Adjusts validators and enables/disables form controls based on the checkbox state.
   */
  onCheckboxChange($event: MatCheckboxChange): void {
    const controls = ['username', 'password'].map(
      (name) => this.form.get(name) as FormControl
    );
    const validators = $event.checked ? null : Validators.required;

    controls.forEach((control) => {
      control.clearValidators();
      control.setValidators(validators);
      $event.checked ? control.disable() : control.enable();
      control.updateValueAndValidity();
    });
  }

  /*
   * Used as disabled value for the buttons
   */
  isFormInvalid(): boolean {
    return this.form.invalid;
  }

  /*
   * Assign the clicked button to buttonSelected prior to form submission
   */
  onButtonClick(selectedButton: ButtonSelected): void {
    this.clickedButton = selectedButton;
  }

  onSubmit(): void {
    const { username, password, checkBox } = this.form.value;

    if (!this.clickedButton) return;
    this.unsubscribeSubscriptions();

    const user = checkBox ? DEFAULT_USER : { username, password };

    this.fetchingData = true;
    const subscription = this.processService
      .getProcess(user.username, user.password)
      .subscribe({
        next: (process: Process) => {
          this.fetchingData = false;
          switch (this.clickedButton) {
            case ButtonSelected.GET_VARIABLES:
              this.processService.processSubject$.next({process, button: ButtonSelected.GET_VARIABLES});
              break;
            case ButtonSelected.GET_VARIABLE_OCCURENCE:
              this.processService.processSubject$.next({process, button: ButtonSelected.GET_VARIABLE_OCCURENCE});
              break;
            case ButtonSelected.GET_PARENT_STEP_LIST:
              this.processService.processSubject$.next({process, button: ButtonSelected.GET_PARENT_STEP_LIST});
              break;
          }
        },
        error: (errorMsg: string) => {
          this.fetchingData = false;
          this.snackBar.open(errorMsg, 'Close', { duration: 5000 });
        },
      });

    this.processSubscriptions.push(subscription);
  }

  unsubscribeSubscriptions(): void {
    this.processSubscriptions.forEach((sub) => sub.unsubscribe());
  }

  ngOnDestroy(): void {
    this.unsubscribeSubscriptions();
  }
}
