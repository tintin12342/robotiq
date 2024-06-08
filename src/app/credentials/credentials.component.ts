import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import {
  FormControl,
  FormGroup,
  FormGroupDirective,
  FormsModule,
  NgForm,
  ReactiveFormsModule,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  MatCheckboxChange,
  MatCheckboxModule,
} from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';

export class MyErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(
    control: FormControl | null,
    form: FormGroupDirective | NgForm | null
  ): boolean {
    const isSubmitted = form && form.submitted;
    return !!(
      control &&
      control.invalid &&
      (control.dirty || control.touched || isSubmitted)
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
    MatButtonModule,
  ],
  templateUrl: './credentials.component.html',
  styleUrl: './credentials.component.scss',
})
export class CredentialsComponent {
  matcher = new MyErrorStateMatcher();

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
    const controls: FormControl[] = ['username', 'password'].map(
      (name) => this.form.get(name) as FormControl
    );
    const validators: ValidatorFn | null = $event.checked
      ? null
      : Validators.required;

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
  onButtonClick(selectedButton: ButtonSelected) {
    this.clickedButton = selectedButton;
  }

  onSubmit() {
    if (!this.clickedButton) return;
    switch (this.clickedButton) {
      case ButtonSelected.GET_VARIABLES:
        // TODO:: Implement GET_VARIABLES
        break;
      case ButtonSelected.GET_VARIABLE_OCCURENCE:
        // TODO:: Implement GET_VARIABLE_OCCURENCE
        break;
      case ButtonSelected.GET_PARENT_STEP_LIST:
        // TODO:: Implement GET_PARENT_STEP_LIST
        break;
      default:
        console.log('Unknown button clicked');
    }
  }
}
