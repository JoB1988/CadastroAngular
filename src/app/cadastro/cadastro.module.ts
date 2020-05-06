import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CadastroComponent } from './cadastro.component';
import { CommonModule } from '@angular/common';
import { CadastroService } from './cadastro.service';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [CadastroComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, HttpClientModule],
  exports: [CadastroComponent],
  providers: [CadastroService]
})
export class CadastroModule {}
