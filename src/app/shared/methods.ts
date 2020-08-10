import { NgForm } from '@angular/forms';
import { ElementRef } from '@angular/core';

export class Important {
    public static cleanForm(elementRef: ElementRef, form: NgForm) {
        elementRef.nativeElement.focus();
        form.resetForm();
    }

    public static allowNumbers($event) {
        switch ($event.keyCode) {
            case 48:
            case 49:
            case 50:
            case 51:
            case 52:
            case 53:
            case 54:
            case 55:
            case 56:
            case 57:
            case 58:
                break;
            default:
                $event.preventDefault();
                break;
        }
    }
}
