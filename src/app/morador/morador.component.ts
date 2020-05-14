import { Component, OnInit } from '@angular/core';
import { MoradorService } from './morador.service';
import { Morador } from '../shared/app.model';
import { ToastService } from '../shared/toast/toast.service';

@Component({
  selector: 'app-morador',
  templateUrl: './morador.component.html',
  styleUrls: ['./morador.component.scss'],
})
export class MoradorComponent implements OnInit {

  constructor(
    private moradorService: MoradorService,
    private toastService: ToastService
  ) { }

  public ngOnInit(): void {
    this.moradorService.getMorador().subscribe();
  }

  public showDialog(morador?: Morador) {

  }

  public action(event) {
    const ACTION =  event.action.toLowerCase();
    const ID = this.moradorService.morador$.value[event.arrayIndex].id;
    switch (ACTION) {
      case 'update':
        this.moradorService.getMorador(ID).subscribe((morador: Morador) => {
          this.showDialog(morador);
        }, error => {
          this.toastService.toast$.next({ message: 'Um erro ocorreu ao buscar o morador', type: 'error', show: true });
        });
        break;
      case 'remove':
        this.moradorService.getMorador(event.arrayIndex).subscribe((response) => {
          this.toastService.toast$.next({ message: 'Morador removido com sucesso', type: 'success', show: true });
        }, error => {
          this.toastService.toast$.next({ message: 'Um erro ocorreu ao remover o morador', type: 'error', show: true });
        });
        break;
      case 'more':
        console.log(event);
        break;
    }
  }

}
