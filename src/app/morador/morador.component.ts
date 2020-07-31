import { Component, OnDestroy } from '@angular/core';
import { MoradorService } from './morador.service';
import { Morador } from '../shared/app.model';
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
    { name: 'nome', object: 'personal', attribute: 'name', arrowType: 'fa-circle' },
    { name: 'cpf', object: 'personal', attribute: 'cpf', arrowType: 'fa-circle' },
    { name: 'tel', object: 'personal', attribute: 'tel', arrowType: 'fa-circle' },
    { name: 'cel', object: 'personal', attribute: 'cel', arrowType: 'fa-circle' },
    { name: 'bloco', object: 'condominium', attribute: 'block', arrowType: 'fa-circle' },
    { name: 'unidade', object: 'condominium', attribute: 'unit', arrowType: 'fa-circle' },
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
    private readonly moradorService: MoradorService
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
  private sortDec(object, attribute) {
    this.morador$.value.sort((a, b) => {
      if (a[object][attribute] < b[object][attribute]) {
        return -1;
      }
      return 1;
    });
  }

  /* Método que ordena de forma crescente */
  private sortAsc(object, attribute) {
    this.morador$.value.sort((a, b) => {
      if (a[object][attribute] > b[object][attribute]) {
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
          this.sortDec(th.object, th.attribute);
          element.arrowType = 'fa-arrow-up';
        } else {
          this.sortAsc(th.object, th.attribute);
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

  public remove(arrayPosition, moradorId) {
    this.moradorService.delete(moradorId).subscribe((data) => {
      console.log('removido com sucesso')
      this.morador$.value.splice(arrayPosition, 1);
    }, (error) => {
      console.log('erro')
    });
  }

  public action(morador?: Morador, index?: any) {
    if (index) {
      this.moradorService.getMorador(morador.id).subscribe((moradorResponse: Morador) => {
        this.showForm(morador, index);
      }, error => {
        console.log('Um erro ocorreu ao buscar o morador');
      });
    } else {
      this.showForm(morador);
    }
  }

  public showForm(morador: Morador, index?) {
    const dialogRef = this.dialog.open(MoradorDialogComponent, {
      minWidth: 250,
      maxWidth: 800,
      width: '100%',
      height: '500px',
      data: morador
    });
    dialogRef.afterClosed().subscribe((moradorForm: Morador) => {
      if (!moradorForm) {
        return;
      }
      console.log(moradorForm)
      if (moradorForm.id) {
        this.moradorService.updateForm(moradorForm).subscribe((moradorResponse: Morador) => {
          this.morador$.value[index] = moradorResponse;
          console.log('Atualizado com sucesso')
        }, (error) => {
          console.log(error)
        });
      } else {
        this.moradorService.saveForm(moradorForm).subscribe((moradorResponse: Morador) => {
          this.morador$.value.push(moradorResponse);
          console.log('Salvo com sucesso')
        }, (error) => {
          console.log(error)
        });
      }
    });
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
      'Morador: ' + morador.personal.name
    ], 15, 25);

    moradorPdf.save(`${morador.personal.name.replace(' ', '')}.pdf`);

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

// rg formato, mudar dinamicamente quando for  0.000.000 e  00.000.000-X
// ajustar stteper em formatos pequenos
// Ajustar componente cadastro para cadastro de funcionário

// ajustar busca para buscar por qualquer coisa que a pessoa digitou
// Ajustar filtro para filtrar por número mínimo e máximo de apartamentos, por bloco
// criar paginação
// criar quantidade de itens por tela
// verificar acessibilidade
// Exportar o pdf

// Na home colocar um vídeo institucional
// Criar Fale conosco com um textbox que a pessoa pode estilizar a mensagem
// Nas áreas comum, cadastrar as áreas comum do condomínio e já aproveitar para reservar uma delas. Juntar a tela de cadastro com a de reservas e log

// Posteriormente, ativar uma opção que permite a table virar um card
// Cadastro de funcionários
