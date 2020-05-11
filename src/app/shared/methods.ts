import { NgForm } from '@angular/forms';
import { ElementRef } from '@angular/core';

export class Important {
    public static cleanForm(nameInput: ElementRef, form: NgForm) {
        nameInput.nativeElement.focus();
        form.resetForm();
    }
}
