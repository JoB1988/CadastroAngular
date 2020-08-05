import { Component, OnInit, Input, HostListener, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

  @Input() options;
  @Output() close = new EventEmitter(false);
  @Output() filterValues = new EventEmitter();

  public form: any[] = [];

  constructor() { }

  ngOnInit(): void {
    this.optionsFormated();
  }

  public filter() {
    this.filterValues.emit(this.form);
  }

  public change(event) {
    if (event.target.type === 'checkbox') {
      this.form.forEach(element => {
        if (element.key === event.target.id.replace('input__', '')) {
          element.value = event.target.checked;
        }
      });
    } else {
      console.log(event)
    }

  }

  public optionsFormated() {
    const newOptions = [];
    this.options.forEach(option => {
      if (option.value.length) {
        option.value.forEach((element, index) => {
          newOptions.push(
            {
              value: element,
              inputType: option.inputType,
              elementName: option.elementName,
              elementNameTranslate: option.elementNameTranslate
            }
          );
          this.form.push({ key: option.elementName + '__' + option.value[index], value: false });
        });
      } else {
        newOptions.push(option);
        this.form.push({ key: option.elementName, value: '' });
      }
    });
    this.options = newOptions;
  }

  //  Ao dar resize, ele verifica a necessidade de mostrar o hamburguer
  @HostListener('window:click', ['$event']) onClickPage() {
    this.close.emit(false);
  }

}
