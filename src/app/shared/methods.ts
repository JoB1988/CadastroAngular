import { NgForm } from '@angular/forms';
import { ElementRef } from '@angular/core';

export class Important {
    public static cleanForm(elementRef: ElementRef, form: NgForm) {
        elementRef.nativeElement.focus();
        form.resetForm();
    }
}
