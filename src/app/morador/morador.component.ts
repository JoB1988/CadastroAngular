import { Component, OnDestroy } from '@angular/core';
import { MoradorService } from './morador.service';
import { Morador } from '../shared/app.model';
import { MatDialog } from '@angular/material/dialog';
import { MoradorDialogComponent } from './morador-dialog/morador-dialog.component';
import { BehaviorSubject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import * as jsPDF from 'jspdf';
import { IFilter } from './morador';

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

  public thead = [
    { name: 'nome', group: 'personal', attribute: 'name', arrowType: 'fa-circle' },
    { name: 'idade', group: 'personal', attribute: 'age', arrowType: 'fa-circle' },
    { name: 'cpf', group: 'personal', attribute: 'cpf', arrowType: 'fa-circle' },
    { name: 'tel', group: 'personal', attribute: 'tel', arrowType: 'fa-circle' },
    { name: 'cel', group: 'personal', attribute: 'cel', arrowType: 'fa-circle' },
    { name: 'bloco', group: 'condominium', attribute: 'block', arrowType: 'fa-circle' },
    { name: 'unidade', group: 'condominium', attribute: 'unit', arrowType: 'fa-circle' },
    { name: '...' }
  ];

  public filterOptions: IFilter[] = [];

  public searchInput$: BehaviorSubject<string> = new BehaviorSubject('');
  public progressBar$: BehaviorSubject<any> = new BehaviorSubject({ mode: 'indeterminate', value: null });
  public moradores$: BehaviorSubject<Array<Morador>> = new BehaviorSubject(undefined);
  public moradores: Array<Morador>;
  // public moradores = undefined;
  public openNavBar = false;
  public moradorSearch: Array<Morador>;
  public condominiumBlockNames = [];
  public moradoresAges = [];
  public condominiumUnits = [];

  private moradoresSubscription = this.moradorService.moradores$.subscribe((moradores) => {
    if (!moradores) {
      this.moradorService.getMorador().subscribe((response) => {
        this.adjustArray(response);
      }, (error) => {
        this.progressBar$.next({ mode: 'determinate', value: 100 });
      });
    } else {
      this.adjustArray(moradores);
    }
  });

  private searchInputSubscription = this.searchInput$.pipe(debounceTime(400)).subscribe((typedValue) => {
    if (!typedValue) {
      if (this.moradores && this.moradores.length > 0) {
        this.moradores$.next(this.moradores);
      }
      return;
    }
    this.progressBar$.next({ mode: 'indeterminate', value: null });
    const search = this.moradores.filter(morador => {
      return (
        morador.personal.name.toLowerCase().includes(typedValue.toLowerCase().trim()) ||
        (morador.personal.tel && morador.personal.tel.toLowerCase().includes(typedValue.toLowerCase().trim())) ||
        (morador.personal.cel && morador.personal.cel.toLowerCase().includes(typedValue.toLowerCase().trim())) ||
        morador.personal.cpf.toLowerCase().includes(typedValue.toLowerCase().trim()) ||
        morador.condominium.block.toLowerCase().includes(typedValue.toLowerCase().trim()) ||
        morador.condominium.unit.toString().includes(typedValue.toLowerCase().trim())
      );
    });
    this.moradores$.next(search);
    this.progressBar$.next({ mode: 'determinate', value: 100 });
  });

  constructor(
    public readonly dialog: MatDialog,
    private readonly moradorService: MoradorService
  ) { }

  public ngOnDestroy(): void {
    this.moradoresSubscription.unsubscribe();
    this.searchInputSubscription.unsubscribe();
  }

  // #region sort
  private sortMoradorByDecreasing(group, attribute) {
    this.moradores$.value.sort((a, b) => {
      if (a[group][attribute] < b[group][attribute]) {
        return -1;
      }
      return 1;
    });
  }

  private sortMoradorByGrowing(group, attribute) {
    this.moradores$.value.sort((a, b) => {
      if (a[group][attribute] > b[group][attribute]) {
        return -1;
      }
      return 1;
    });
  }

  public onMoradorSort(thead: any) {
    this.thead.forEach(theadeElement => {
      if (theadeElement.name === thead.name) {
        if (theadeElement.arrowType === 'fa-circle' || theadeElement.arrowType === 'fa-arrow-down') {
          this.sortMoradorByDecreasing(thead.group, thead.attribute);
          theadeElement.arrowType = 'fa-arrow-up';
        } else {
          this.sortMoradorByGrowing(thead.group, thead.attribute);
          theadeElement.arrowType = 'fa-arrow-down';
        }
      } else {
        theadeElement.arrowType = 'fa-circle';
      }
    });
  }
  //#endregion

  //#region crud
  public deleteMorador(arrayPosition, moradorId) {
    this.moradorService.deleteMorador(moradorId).subscribe(() => {
      console.log('removido com sucesso')
      this.moradores$.value.splice(arrayPosition, 1);
    }, () => {
      console.log('erro')
    });
  }

  public newMorador() {
    this.showMoradorForm();
  }

  public editMorador(morador: Morador, index: number) {
    this.moradorService.getMorador(morador.id).subscribe(() => {
      this.showMoradorForm(morador, index);
    }, () => {
      console.log('Um erro ocorreu ao buscar o morador');
    });
  }
  //#endregion

  private showMoradorForm(morador?: Morador, index?) {
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
        this.moradorService.updateMorador(moradorForm).subscribe((moradorResponse: Morador) => {
          this.moradores$.value[index] = moradorResponse;
          console.log('Atualizado com sucesso')
        }, (error) => {
          console.log(error)
        });
      } else {
        this.moradorService.createMorador(moradorForm).subscribe((moradorResponse: Morador) => {
          this.moradores$.value.push(moradorResponse);
          console.log('Salvo com sucesso')
        }, (error) => {
          console.log(error)
        });
      }
    });
  }

  private adjustArray(moradores: Morador[]) {
    this.moradores = this.addAgeToArray(moradores);
    this.moradores$.next(moradores);
    this.filterOptions = this.getFilterOptions();
    this.progressBar$.next({ mode: 'determinate', value: 100 });
  }

  private addAgeToArray(moradores: Morador[]): Morador[] {
    const today = new Date();
    moradores.forEach(morador => {
      const moradorBirthday = new Date(morador.personal.birthDate);
      if (today.getMonth() > moradorBirthday.getMonth()) {
        morador.personal.age = today.getFullYear() - moradorBirthday.getFullYear();
      } else {
        if (today.getMonth() === moradorBirthday.getMonth()) {
          if (today.getDate() < moradorBirthday.getDate()) {
            morador.personal.age = today.getFullYear() - moradorBirthday.getFullYear() - 1;
          } else {
            morador.personal.age = today.getFullYear() - moradorBirthday.getFullYear();
          }
        } else {
          morador.personal.age = today.getFullYear() - moradorBirthday.getFullYear() - 1;
        }
      }
      this.moradoresAges.push(morador.personal.age);
      this.condominiumUnits.push(morador.condominium.unit);
      this.condominiumBlockNames.push(morador.condominium.block);
    });
    return moradores;
  }

  public openFilterMenu(event) {
    event.stopPropagation();
    this.openNavBar = !this.openNavBar;
  }

  // rever foreachs
  private getFilterOptions(): IFilter[] {
    const filterOptions: IFilter[] = [];
    // retorna um array sem nomes/números repetidos
    this.condominiumBlockNames = this.sortArrayByGrowing(
      this.condominiumBlockNames.filter(
        (blockName, index, condominiumBlockNames) => condominiumBlockNames.indexOf(blockName) === index
      )
    );
    this.moradoresAges = this.sortArrayByGrowing(
      this.moradoresAges.filter(
        (age, index, moradoresAges) => moradoresAges.indexOf(age) === index
      )
    );
    this.condominiumUnits = this.sortArrayByGrowing(
      this.condominiumUnits.filter((unit, index, condominiumUnits) => condominiumUnits.indexOf(unit) === index
      )
    );
    this.condominiumBlockNames.forEach(block => {
      filterOptions.push({
        elementName: 'block_' + block,
        actualValue: false,
        inputType: 'checkbox',
        elementNameTranslate: 'Bloco ' + block
      });
    });
    filterOptions.push({
      elementName: 'unit',
      minValue: this.condominiumUnits[0],
      maxValue: this.condominiumUnits[this.condominiumUnits.length - 1],
      actualValue: [this.condominiumUnits[0], this.condominiumUnits[this.condominiumUnits.length - 1]],
      inputType: 'number',
      elementNameTranslate: 'Unidade'
    });
    filterOptions.push({
      elementName: 'age',
      minValue: this.moradoresAges[0],
      maxValue: this.moradoresAges[this.condominiumUnits.length],
      actualValue: this.moradoresAges[0],
      inputType: 'range',
      elementNameTranslate: 'Idade'
    });
    return filterOptions;
  }

  private sortArrayByGrowing(anyArray: any[]): any[] {
    return anyArray.sort((a, b) => {
      if (a < b) {
        return -1;
      }
      return 1;
    });
  }

  public filterTable(event) {
    if (event === 'limpar') {
      this.filterOptions = this.getFilterOptions();
      return;
    } else if (event === 'sair') {
      return;
    }
    const simpleFilter = {
      unit: {
        minValue: 100,
        maxValue: 2000
      },
      block: [{ key: 'B', value: false }, { key: 'F', value: true }, { key: 'A', value: true }],
      personal: {
        minAge: 10,
        maxAge: 90
      }
    };
    const search = this.moradores.filter((value) => {
      return (
        value.personal.age >= simpleFilter.personal.minAge
        &&
        value.personal.age <= simpleFilter.personal.maxAge
        &&
        value.condominium.unit >= simpleFilter.unit.minValue
        &&
        value.condominium.unit <= simpleFilter.unit.maxValue
        &&
        value.condominium.block === this.verifyBlock(value.condominium.block, simpleFilter.block)
      );
    });
    // this.moradores$.next(search);
  }

  private verifyBlock(block: string, blocks: any[] = []): string | undefined {
    let blockName;
    blocks.forEach((b) => {
      if (block.includes(b.key) && b.value) {
        blockName = block;
      }
    });
    return blockName;
  }

  public numberOfFiltersUsed(): number {
    return 0;
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
    moradorPdf.text(['Dados pessoais'], 15, 25);
    moradorPdf.text(['_____________________________________________________________________________'], 15, 28);
    moradorPdf.text(['Morador: ' + morador.personal.name], 15, 38);

    moradorPdf.text(['Data de Nascimento: ' + this.getBirthDate(morador.personal.birthDate)], 135, 38);

    moradorPdf.text(['CPF: ' + this.getCpf(morador.personal.cpf)], 15, 48);

    moradorPdf.text(['RG: ' + morador.personal.rg], 85, 48);

    moradorPdf.text(['Estado Civil: ' + morador.personal.civilStatus], 155, 48);

    if (morador.personal.civilStatus === 'casado(a)') {
      moradorPdf.text(['Conjuguê: ' + morador.familiar.partner.name], 15, 58);
      space += 10;
    }

    moradorPdf.text(['Telefone: ' + this.comunicationsWay(morador.personal.tel)], 15, 60 + space);

    moradorPdf.text(['Celular: ' + this.comunicationsWay(morador.personal.cel)], 70, 60 + space);

    moradorPdf.text(['Email: ' + this.comunicationsWay(morador.personal.email)], 125, 60 + space);

    moradorPdf.text(['Dados profissionais'], 15, 70 + space);
    moradorPdf.text(['_____________________________________________________________________________'], 15, 73 + space);

    moradorPdf.text(['Profissão: ' + morador.professional.profession], 15, 83 + space);

    moradorPdf.text(['Salário: R$ ' + morador.professional.salary.toFixed(2)], 160, 83 + space);

    moradorPdf.text(['Dados condominial'], 15, 95 + space);
    moradorPdf.text(['_____________________________________________________________________________'], 15, 98 + space);

    moradorPdf.text(['Bloco: ' + morador.condominium.block], 15, 108 + space);

    moradorPdf.text(['Unidade: ' + morador.condominium.unit], 75, 108 + space);

    // Opção 2

    // moradorPdf.text(['Morador: ' + morador.personal.name], 15, 25);

    // moradorPdf.text(['Data de Nascimento: ' + this.getBirthDate(morador.personal.birthDate)], 15, 35);

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

  private getBirthDate(birthDate: Date): string {
    return new Date(birthDate).toLocaleDateString();
  }

  private comunicationsWay(phoneNumber: string): string {
    if (!phoneNumber) {
      return 'N/C';
    }
    if (phoneNumber.length === 10) {
      return '(' + phoneNumber.substr(0, 2) + ') ' + phoneNumber.substr(2, 4) + '-' + phoneNumber.substr(6, 4);
    } else if (phoneNumber.length === 11) {
      return '(' + phoneNumber.substr(0, 2) + ') ' + phoneNumber.substr(2, 5) + '-' + phoneNumber.substr(6, 4);
    } else {
      return phoneNumber;
    }
  }

  private getCpf(cpf: string): string {
    return cpf.substr(0, 3) + '.' + cpf.substr(3, 3) + '.' + cpf.substr(6, 3) + '-' + cpf.substr(9, 2);
  }
}

// filtrar o componente morador
// ajustar css do componente de filter

// ajustar acessibilidade do componente de filtrar
// ajustar acessibilidade do componente de sidebar
// ajustar acessibilidade do componente de header
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
// ajustar form min e max value da buscar
// criar hint no botão filtrar
// rever foreachs
// validar campos do filtro


// let a = [
//   { personal: { age: 1 }, condominium: { block: 'A', unit: 110 } },
//   { personal: { age: 1 }, condominium: { block: 'B', unit: 540 } },
//   { personal: { age: 2 }, condominium: { block: 'C', unit: 390 } },
//   { personal: { age: 3 }, condominium: { block: 'D', unit: 220 } },
//   { personal: { age: 5 }, condominium: { block: 'A', unit: 450 } },
//   { personal: { age: 8 }, condominium: { block: 'B', unit: 670 } },
//   { personal: { age: 13 }, condominium: { block: 'C', unit: 790 } },
//   { personal: { age: 21 }, condominium: { block: 'D', unit: 810 } },
//   { personal: { age: 34 }, condominium: { block: 'A', unit: 930 } },
//   { personal: { age: 55 }, condominium: { block: 'A', unit: 1060 } },
//   { personal: { age: 89 }, condominium: { block: 'B', unit: 180 } },
//   { personal: { age: 143 }, condominium: { block: 'B', unit: 240 } },
//   { personal: { age: 2 }, condominium: { block: 'C', unit: 320 } },
//   { personal: { age: 4 }, condominium: { block: 'C', unit: 430 } },
//   { personal: { age: 6 }, condominium: { block: 'D', unit: 590 } },
//   { personal: { age: 10 }, condominium: { block: 'D', unit: 650 } },
//   { personal: { age: 16 }, condominium: { block: 'A', unit: 760 } },
//   { personal: { age: 26 }, condominium: { block: 'B', unit: 880 } },
//   { personal: { age: 42 }, condominium: { block: 'C', unit: 970 } },
//   { personal: { age: 1 }, condominium: { block: 'D', unit: 1010 } }
// ]

// multipluValidation = (block, array) => {
//   let newArray;
//   array.foreach(value => {
//     if (block === value) {
//       newArray.push(block);
//     }
//   })
//   return newArray
// }