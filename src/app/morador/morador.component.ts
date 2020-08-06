import { Component, OnDestroy } from '@angular/core';
import { MoradorService } from './morador.service';
import { Morador } from '../shared/app.model';
import { MatDialog } from '@angular/material/dialog';
import { MoradorDialogComponent } from './morador-dialog/morador-dialog.component';
import { BehaviorSubject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import * as jsPDF from 'jspdf';
import { IFilter } from './morador';
import { ValueConverter } from '@angular/compiler/src/render3/view/template';

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

  public options: IFilter[] = [
    { values: { min: 110, max: 2040, actual: 0 }, inputType: 'range', elementName: 'unit', elementNameTranslate: 'unidade' },
    { values: { value: 'A', checked: false }, inputType: 'checkbox', elementName: 'block', elementNameTranslate: 'bloco' },
    { values: { value: 'B', checked: false }, inputType: 'checkbox', elementName: 'block', elementNameTranslate: 'bloco' },
    { values: { value: 'C', checked: false }, inputType: 'checkbox', elementName: 'block', elementNameTranslate: 'bloco' }
  ];

  public inputValue$: BehaviorSubject<string> = new BehaviorSubject('');
  public progressBar$: BehaviorSubject<any> = new BehaviorSubject({ mode: 'indeterminate', value: null });
  public morador$: BehaviorSubject<Array<Morador>> = new BehaviorSubject(undefined);
  public morador = undefined;
  public openMenu = false;

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

  private inputValueSubscription = this.inputValue$.pipe(debounceTime(400)).subscribe((inputValue) => {
    if (!inputValue) {
      if (this.morador && this.morador.length > 0) {
        this.morador$.next(this.morador);
      }
      return;
    }
    this.progressBar$.next({ mode: 'indeterminate', value: null });
    // Busca de múltiplos atributos
    const search = this.morador.filter(obejct => {
      return (
        obejct.personal.name.toLowerCase().includes(inputValue.toLowerCase().trim()) ||
        (obejct.personal.tel && obejct.personal.tel.toLowerCase().includes(inputValue.toLowerCase().trim())) ||
        (obejct.personal.cel && obejct.personal.cel.toLowerCase().includes(inputValue.toLowerCase().trim())) ||
        obejct.personal.cpf.toLowerCase().includes(inputValue.toLowerCase().trim()) ||
        obejct.condominium.block.toLowerCase().includes(inputValue.toLowerCase().trim()) ||
        obejct.condominium.unit.toString().includes(inputValue.toLowerCase().trim())
      );
    });
    this.morador$.next(search);
    this.progressBar$.next({ mode: 'determinate', value: 100 });
  });

  constructor(
    public readonly dialog: MatDialog,
    private readonly moradorService: MoradorService
  ) { }

  public ngOnDestroy(): void {
    this.moradorSubscription.unsubscribe();
    this.inputValueSubscription.unsubscribe();
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

  public remove(arrayPosition, moradorId) {
    this.moradorService.delete(moradorId).subscribe((data) => {
      console.log('removido com sucesso')
      this.morador$.value.splice(arrayPosition, 1);
    }, (error) => {
      console.log('erro')
    });
  }

  public action(morador?: Morador, index?: number) {
    if (index >= 0) {
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

  public openFilter(event) {
    event.stopPropagation();
    this.openMenu = !this.openMenu;
  }

  public filter(options: IFilter[]) {
    this.options = options;
    console.log(this.options);
  }

  public downloadAsPDF(morador: Morador) {

    let space = 0;

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
    moradorPdf.text(['Morador: ' + morador.personal.name], 15, 25);

    moradorPdf.text(['Data de Nascimento: ' + this.getBornDate(morador.personal.bornDate)], 135, 25);

    moradorPdf.text(['CPF: ' + this.getCpf(morador.personal.cpf)], 15, 35);

    moradorPdf.text(['RG: ' + morador.personal.rg], 85, 35);

    moradorPdf.text(['Estado Civil: ' + morador.personal.civilStatus], 155, 35);

    if (morador.personal.civilStatus === 'casado(a)') {
      moradorPdf.text(['Conjuguê: ' + morador.familiar.partner.name], 15, 45);
      space += 10;
    }

    moradorPdf.text(['Telefone: ' + this.comunicationsWay(morador.personal.tel)], 15, 45 + space);

    moradorPdf.text(['Celular: ' + this.comunicationsWay(morador.personal.cel)], 70, 45 + space);

    moradorPdf.text(['Email: ' + this.comunicationsWay(morador.personal.email)], 125, 45 + space);

    moradorPdf.text(['Profissão: ' + morador.professional.profession], 15, 55 + space);

    moradorPdf.text(['Salário: R$ ' + morador.professional.salary.toFixed(2)], 160, 55 + space);

    moradorPdf.text(['Bloco: ' + morador.condominium.block], 15, 65 + space);

    moradorPdf.text(['Unidade: ' + morador.condominium.unit], 75, 65 + space);

    // Opção 2

    // moradorPdf.text(['Morador: ' + morador.personal.name], 15, 25);

    // moradorPdf.text(['Data de Nascimento: ' + this.getBornDate(morador.personal.bornDate)], 15, 35);

    // moradorPdf.text(['CPF: ' + this.getCpf(morador.personal.cpf)], 15, 45);

    // moradorPdf.text(['RG: ' + morador.personal.rg], 15, 55);

    // moradorPdf.text(['Estado Civil: ' + morador.personal.civilStatus], 15, 65);

    // if (this.isMarried(morador.personal.civilStatus)) {
    //   moradorPdf.text(['Conjuguê: ' + morador.familiar.partner.name], 15, 75);
    // }

    // moradorPdf.text(['Telefone: ' + this.comunicationsWay(morador.personal.tel)], 15, 85);

    // moradorPdf.text(['Celular: ' + this.comunicationsWay(morador.personal.cel)], 15, 85);

    // moradorPdf.text(['Email: ' + this.comunicationsWay(morador.personal.email)], 15, 95);

    // moradorPdf.text(['Profissão: ' + morador.professional.profession], 15, 105);

    // moradorPdf.text(['Salário: R$ ' + morador.professional.salary.toFixed(2)], 15, 115);

    // moradorPdf.text(['Bloco: ' + morador.condominium.block], 15, 125);

    // moradorPdf.text(['Unidade: ' + morador.condominium.unit], 15, 135);

    moradorPdf.save(`${morador.personal.name.replace(' ', '')}.pdf`);
  }

  private getBornDate(bornDate: Date): string {
    return new Date(bornDate).toLocaleDateString();
  }

  private comunicationsWay(numberValue: string): string {
    if (!numberValue) {
      return 'N/C';
    }
    if (numberValue.length === 10) {
      return '(' + numberValue.substr(0, 2) + ') ' + numberValue.substr(2, 4) + '-' + numberValue.substr(6, 4);
    } else if (numberValue.length === 11) {
      return '(' + numberValue.substr(0, 2) + ') ' + numberValue.substr(2, 5) + '-' + numberValue.substr(6, 4);
    } else {
      return numberValue;
    }
  }

  private getCpf(cpf: string): string {
    return cpf.substr(0, 3) + '.' + cpf.substr(3, 3) + '.' + cpf.substr(6, 3) + '-' + cpf.substr(9, 2);
  }
}

// filtrar o componente morador
// ajustar acessibilidade do componente de filtrar
// ajustar acessibilidade do componente de sidebar
// ajustar acessibilidade do componente de header
// criar hint no botão filtrar
// adicionar à acessibilidade quantos valores o botão filtrar tem
// criar dialog para confirmar exclusão de cadastros
// criar paginação
// criar quantidade de itens por tela
// Na home colocar um vídeo institucional
// Ajustar componente cadastro para cadastro de funcionário
// Criar Fale conosco com um textbox que a pessoa pode estilizar a mensagem
// Nas áreas comum, cadastrar as áreas comum do condomínio e já aproveitar para reservar uma delas. Juntar a tela de cadastro com a de reservas e log
// Posteriormente, ativar uma opção que permite a table virar um card
// Cadastro de funcionários
// Ajustart mask do rg para quando for editar
