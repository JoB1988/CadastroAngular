import { Component, OnInit, Input, HostListener, Output, EventEmitter, AfterViewInit, ElementRef } from '@angular/core';
import { IFilter } from 'src/app/morador/morador';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Important } from '../methods';
import { EmbeddedTemplateAst } from '@angular/compiler';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements AfterViewInit, OnInit {

  @Input() filterOptions: IFilter[];
  @Output() closeMenu = new EventEmitter(false);
  @Output() filterValues = new EventEmitter();

  public filterForm: FormGroup;

  constructor(public elementRef: ElementRef, public readonly formBuilder: FormBuilder) { }

  public ngOnInit(): void {
    this.filterForm = this.formBuilder.group({});
    this.filterOptions.forEach(filterOption => {
      if (filterOption.actualValue.length) {
        filterOption.actualValue.forEach((value, i) => {
          this.filterForm.addControl(filterOption.elementName + i, this.formBuilder.control(value));
        });
      } else {
        this.filterForm.addControl(filterOption.elementName, this.formBuilder.control(filterOption.actualValue));
      }
    });
  }

  public ngAfterViewInit(): void {
    this.filterOptions.forEach(filterOption => {
      if (filterOption.inputType === 'range') {
        this.elementRef.nativeElement.querySelector(`#${filterOption.elementName}`).valueAsNumber = filterOption.actualValue;
      }
    });
  }

  public changeCheckbox(event) {
    this.filterForm.controls[event.target.id].setValue(event.target.checked);
  }

  public allowNumbers(event) {
    Important.allowNumbers(event);
  }

  public filter(value?: string) {
    if (value !== 'sair') {
      this.filterOptions.forEach(filterOption => {
        if (filterOption.inputType === 'checkbox') {
          filterOption.actualValue = this.filterForm.value[filterOption.elementName];
        } else {
          if (filterOption.actualValue.length > 0) {
            filterOption.actualValue[0] = this.filterForm.value[filterOption.elementName + '0'];
            filterOption.actualValue[1] = this.filterForm.value[filterOption.elementName + '1'];
          } else {
            filterOption.actualValue = parseInt(this.filterForm.value[filterOption.elementName], 0);
          }
        }
      });
    }
    this.filterValues.emit(value);
    this.closeMenu.emit(false);
  }

  //  Ao dar resize, ele verifica a necessidade de mostrar o hamburguer
  @HostListener('window:click', ['$event']) public onClickPage() {
    this.closeMenu.emit(false);
  }
}
