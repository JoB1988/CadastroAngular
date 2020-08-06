import { Component, OnInit, Input, HostListener, Output, EventEmitter, AfterViewInit, ElementRef } from '@angular/core';
import { IFilter } from 'src/app/morador/morador';
import { element } from 'protractor';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements AfterViewInit {

  @Input() options: IFilter[];
  @Output() close = new EventEmitter(false);
  @Output() filterValues = new EventEmitter();

  constructor(public elementRef: ElementRef) { }

  ngAfterViewInit(): void {
    this.options.forEach(element => {
      if (element.inputType === 'range') {
        this.elementRef.nativeElement.querySelector(`#input__${element.elementName}`).valueAsNumber = element.values['actual'];
      }
    });
  }

  public filter() {
    this.filterValues.emit(this.options);
    this.close.emit(false);
  }

  public change(event) {
    this.options.forEach(element => {
      if (event.target.id.replace('input__', '') === element.elementName) {
        element.values['actual'] = event.target.valueAsNumber;
      } else if (event.target.id.replace('input__', '') === `${element.elementName}__${element.values['value']}`) {
        element.values['actual'] = event.target.checked;
      }
    });
  }

  //  Ao dar resize, ele verifica a necessidade de mostrar o hamburguer
  @HostListener('window:click', ['$event']) onClickPage() {
    this.close.emit(false);
  }
}
