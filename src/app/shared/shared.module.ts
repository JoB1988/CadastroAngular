import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { MatDialogModule } from '@angular/material/dialog';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatButtonModule } from '@angular/material/button';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

const ANGULAR_MODULES = [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule
];

const OTHER_MODULES = [
    NgxSpinnerModule,
    MatDialogModule,
    MatProgressBarModule,
    MatButtonModule,
    MatProgressSpinnerModule
];

@NgModule({
    imports: [...ANGULAR_MODULES, ...OTHER_MODULES],
    exports: [...ANGULAR_MODULES, ...OTHER_MODULES]
})
export class SharedModule { }
