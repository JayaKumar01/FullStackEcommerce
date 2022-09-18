import { FormControl, ValidationErrors } from "@angular/forms";

export class CustomValidators { 

    static hasWhitespace(control: FormControl): ValidationErrors {

        if((control.value != null) && (control.value.trim().length === 0)) {

            return {'hasWhitespace': true};
        }
        else {
            return null;
        } 

        
    }
}
