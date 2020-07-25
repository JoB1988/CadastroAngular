import { Component, OnInit, OnDestroy } from '@angular/core';
import { MoradorService } from './morador.service';
import { Morador } from '../shared/app.model';
import { ToastService } from '../shared/toast/toast.service';
import { MatDialog } from '@angular/material/dialog';
import { MoradorDialogComponent } from './morador-dialog/morador-dialog.component';
import { BehaviorSubject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import * as jsPDF from 'jspdf';

@Component({
  selector: 'app-morador',
  templateUrl: './morador.component.html',
  styleUrls: ['./morador.component.scss'],
})
export class MoradorComponent implements OnDestroy {

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
  public morador = undefined;

  private moradorSubscription = this.moradorService.morador$.subscribe((data) => {
    if (!data) {
      this.moradorService.getMorador().subscribe((response) => {
        this.setArray(response);
      }, (error) => {
        this.progressBar$.next({ mode: 'determinate', value: 100 });
      });
    } else {
      this.setArray(data);
    }
  });

  private inputValueSubscription = this.inputValue$.pipe(debounceTime(300)).subscribe((inputValue) => {
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

  public ngOnDestroy(): void {
    this.moradorSubscription.unsubscribe();
    this.inputValueSubscription.unsubscribe();
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

  // #region sort
  /* Método que ordena de forma decrescente */
  private sortDec(thName) {
    this.morador$.value.sort((a, b) => {
      if (a[thName] < b[thName]) {
        return -1;
      }
      return 1;
    });
  }

  /* Método que ordena de forma crescente */
  private sortAsc(thName) {
    this.morador$.value.sort((a, b) => {
      if (a[thName] > b[thName]) {
        return -1;
      }
      return 1;
    });
  }

  /* Método que ajusta as setas da table */
  public onSort(th: any) {
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
  //#endregion

  public filter() {
  }

  public buttonAction(option, value) {
  }

  public showDialog(morador?: Morador, edit?: boolean) {
    const dialogRef = this.dialog.open(MoradorDialogComponent, {
      minWidth: 250,
      maxWidth: 800,
      width: '100%',
      height: '500px',
      data: morador
    });
    dialogRef.afterClosed().subscribe(response => {
      if (response.modificated) {
        if (edit) {
          this.moradorService.updateForm(morador);
        } else {
          this.moradorService.saveForm(morador);
        }
      }
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

  private setArray(value) {
    this.progressBar$.next({ mode: 'determinate', value: 100 });
    this.morador = value;
    this.morador$.next(value);
  }

  public downloadAsPDF(morador: Morador) {

    const moradorPdf = new jsPDF({
      orientation: 'p',
      align: 'center',
      unit: 'mm',
      format: 'a4',
      putOnlyUsedFonts: true,
      floatPrecision: 16,
      lineHeightFactor: 23.15
    });

    moradorPdf.setFontSize(16);
    moradorPdf.text([
      'Condomínio Start SBC'
    ], 15, 15);
    moradorPdf.setFontSize(12);
    moradorPdf.text([
      'Morador: ' + morador.nome
    ], 15, 25);

    moradorPdf.save(`${morador.nome.replace(' ', '')}.pdf`);

    // var doc = new jsPDF();

    // doc.text(20, 20, 'This is the default font.');

    // doc.setFont("courier");
    // doc.setFontType("normal");
    // doc.text(20, 30, 'This is courier normal.');

    // doc.setFont("times");
    // doc.setFontType("italic");
    // doc.text(20, 40, 'This is times italic.');

    // doc.setFont("helvetica");
    // doc.setFontType("bold");
    // doc.text(20, 50, 'This is helvetica bold.');

    // doc.setFont("courier");
    // doc.setFontType("bolditalic");
    // doc.text(20, 60, 'This is courier bolditalic.');

    // // Save the PDF
    // doc.save('document.pdf');
  }
}
