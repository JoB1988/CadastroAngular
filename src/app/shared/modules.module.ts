import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { NgxSpinnerModule } from 'ngx-spinner';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from '../app-routing.module';

const ANGULAR_MODULES = [
    AppRoutingModule,
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
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
export class SharedModule { }
