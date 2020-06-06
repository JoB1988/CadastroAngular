import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';

const ANGULAR_MODULES = [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
];

const OTHER_MODULES = [
    NgxSpinnerModule
];

@NgModule({
    imports: [...ANGULAR_MODULES, ...OTHER_MODULES],
    exports: [...ANGULAR_MODULES, ...OTHER_MODULES]
})
export class SharedModule {}
