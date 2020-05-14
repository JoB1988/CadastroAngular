import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MoradorComponent } from './morador.component';
import { MoradorDialogComponent } from './morador-dialog/morador-dialog.component';
import { MoradorTableComponent } from './morador-table/morador-table.component';
import { MoradorDialogService } from './morador-dialog/morador-dialog.service';
import { MoradorService } from './morador.service';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [
    MoradorComponent,
    MoradorDialogComponent,
    MoradorTableComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule
  ],
  exports: [MoradorComponent],
  providers: [MoradorDialogService, MoradorService]
})
export class MoradorModule { }
