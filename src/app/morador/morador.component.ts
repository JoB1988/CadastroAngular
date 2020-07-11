import { Component, OnInit, OnDestroy } from '@angular/core';
import { MoradorService } from './morador.service';
import { Morador } from '../shared/app.model';
import { ToastService } from '../shared/toast/toast.service';
import { MatDialog } from '@angular/material/dialog';
import { MoradorDialogComponent } from './morador-dialog/morador-dialog.component';
import { BehaviorSubject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-morador',
  templateUrl: './morador.component.html',
  styleUrls: ['./morador.component.scss'],
})
export class MoradorComponent implements OnInit, OnDestroy {

  //#region mascara

  // Regex de letras e números
  public alphaNumericPattern = new RegExp(/^[0-9a-zA-ZãõñàáèéìíòóùúýÀÁÈÉÌÍÒÓÙÚÝäëïöüÿÄËÏÖÜÃÕÑçÇºª ]*$/);
  // Regex somente de letras
  public lettersPattern = new RegExp(/^[a-zA-ZãõñàáèéìíòóùúýÀÁÈÉÌÍÒÓÙÚÝäëïöüÿÄËÏÖÜÃÕÑçÇ ]*$/);
  // Regex somente de números
  public numbersPattern = new RegExp(/^[0-9]*$/);

  // Recursos da LIB ngx-mask
  public mask = 'M{50}';
  public pattern = {
    M: {
      pattern: this.alphaNumericPattern,
      symbol: 'M'
    }
  };

  //#endregion mascara

  // Header
  public thead = [
    { name: 'nome', arrowType: 'fa-circle' },
    { name: 'cpf', arrowType: 'fa-circle' },
    { name: 'tel', arrowType: 'fa-circle' },
    { name: 'cel', arrowType: 'fa-circle' },
    { name: 'bloco', arrowType: 'fa-circle' },
    { name: 'unidade', arrowType: 'fa-circle' },
    { name: '...' }
  ];

  public inputValue$: BehaviorSubject<string> = new BehaviorSubject('');
  public progressBar$: BehaviorSubject<any> = new BehaviorSubject({ mode: 'indeterminate', value: null });
  public morador$: BehaviorSubject<Array<Morador>> = new BehaviorSubject(undefined);
  public morador = [];

  private moradorSubscription = this.moradorService.morador$.subscribe((data) => {
    if (!data) {
      return;
    }
    this.progressBar$.next({ mode: 'determinate', value: 100 });
    this.morador = data;
    this.morador$.next(data);
  });

  private intpuValueSubscription = this.inputValue$.pipe(debounceTime(300)).subscribe((inputValue) => {
    if (!inputValue) {
      this.pattern.M.pattern = this.alphaNumericPattern;
      this.morador$.next(this.morador);
      return;
    }
    this.morador$.next(this.morador.filter((obejct) => obejct[this.onInputChange()].includes(inputValue)));
  });

  constructor(
    public readonly dialog: MatDialog,
    private readonly moradorService: MoradorService,
    private readonly toastService: ToastService,
  ) { }

  public ngOnInit(): void {
    this.moradorService.getMorador().subscribe();
  }

  public ngOnDestroy(): void {
    this.moradorSubscription.unsubscribe();
    this.intpuValueSubscription.unsubscribe();
  }

  public onInputChange(): string {
    if (this.numbersPattern.test(this.inputValue$.value)) {
      this.pattern.M.pattern = this.numbersPattern;
      return 'cpf';
    } else {
      this.pattern.M.pattern = this.lettersPattern;
      return 'nome';
    }
  }

  public sort(th: any) {
    this.thead.forEach(element => {
      if (element.name === th.name) {
        if (element.arrowType === 'fa-circle' || element.arrowType === 'fa-arrow-down') {
          this.sortDec(th.name);
          element.arrowType = 'fa-arrow-up';
        } else {
          this.sortAsc(th.name);
          element.arrowType = 'fa-arrow-down';
        }
      } else {
        element.arrowType = 'fa-circle';
      }
    });
  }

  private sortDec(thName) {
    this.morador$.value.sort((a, b) => {
      if (a[thName] < b[thName]) {
        return -1;
      }
      return 1;
    });
  }

  private sortAsc(thName) {
    this.morador$.value.sort((a, b) => {
      if (a[thName] > b[thName]) {
        return -1;
      }
      return 1;
    });
  }

  public opacityStyle(arrowType): string {
    return arrowType !== 'fa-circle' ? 'opacity: 1' : null;
  }

  public filter() {
  }

  public buttonAction(option, value) {
    console.log(option, value);
  }

  public showDialog(morador?: Morador) {
    const dialogRef = this.dialog.open(MoradorDialogComponent, {
      minWidth: 250,
      maxWidth: 800,
      width: '100%',
      data: {}
    });
    dialogRef.afterClosed().subscribe(result => {
      console.log('Fechou');
    });
  }

  public action(event) {
    const ACTION = event.action.toLowerCase();
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
