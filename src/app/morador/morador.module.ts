import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MoradorComponent } from './morador.component';
import { MoradorDialogComponent } from './morador-dialog/morador-dialog.component';
import { MoradorTableComponent } from './morador-table/morador-table.component';
import { MoradorDialogService } from './morador-dialog/morador-dialog.service';

@NgModule({
  declarations: [
    MoradorComponent,
    MoradorDialogComponent,
    MoradorTableComponent
  ],
  imports: [
    CommonModule
  ],
  exports: [MoradorComponent],
  providers: [MoradorDialogService]
})
export class MoradorModule { }
