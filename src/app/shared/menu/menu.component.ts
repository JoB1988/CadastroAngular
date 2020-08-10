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

  @Input() options: IFilter[];
  @Output() close = new EventEmitter(false);
  @Output() filterValues = new EventEmitter();

  public filterForm: FormGroup;

  constructor(public elementRef: ElementRef, public readonly formBuilder: FormBuilder) { }

  public ngOnInit(): void {
    this.filterForm = this.formBuilder.group({});
    this.options.forEach(element => {
      if (element.actualValue.length) {
        element.actualValue.forEach((value, i) => {
          this.filterForm.addControl(element.elementName + i, this.formBuilder.control(value));
        });
      } else {
        this.filterForm.addControl(element.elementName, this.formBuilder.control(element.actualValue));
      }
    });
  }

  public ngAfterViewInit(): void {
    this.options.forEach(element => {
      if (element.inputType === 'range') {
        this.elementRef.nativeElement.querySelector(`#${element.elementName}`).valueAsNumber = element.actualValue;
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
      this.options.forEach(element => {
        if (element.inputType === 'checkbox') {
          element.actualValue = this.filterForm.value[element.elementName];
        } else {
          if (element.actualValue.length > 0) {
            element.actualValue[0] = this.filterForm.value[element.elementName + '0'];
            element.actualValue[1] = this.filterForm.value[element.elementName + '1'];
          } else {
            element.actualValue = parseInt(this.filterForm.value[element.elementName]);
          }
        }
      });
    }
    this.filterValues.emit(value);
    this.close.emit(false);
  }

  //  Ao dar resize, ele verifica a necessidade de mostrar o hamburguer
  @HostListener('window:click', ['$event']) public onClickPage() {
    this.close.emit(false);
  }
}
