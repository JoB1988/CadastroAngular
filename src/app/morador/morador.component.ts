import { Component, OnInit } from '@angular/core';
import { MoradorDialogService } from './morador-dialog/morador-dialog.service';

@Component({
  selector: 'app-morador',
  templateUrl: './morador.component.html',
  styleUrls: ['./morador.component.scss']
})
export class MoradorComponent implements OnInit {

  constructor(private moradorDialogService: MoradorDialogService) { }

  ngOnInit(): void {
  }

  show() {
    this.moradorDialogService.show();
  }
  hide() {
    this.moradorDialogService.hide();
  }

}
