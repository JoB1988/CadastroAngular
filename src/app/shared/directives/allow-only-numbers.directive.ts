import { Directive, ElementRef, OnInit, HostListener } from '@angular/core';

@Directive({ selector: '[appAllowOnlyNumbers]' })
export class AllowOnlyNumbersDirective implements OnInit {

  constructor(private elementRef: ElementRef<HTMLInputElement>) { }

  ngOnInit(): void { }

  @HostListener('window:keypress', ['$event']) onKeyPress($event: KeyboardEvent) {
    if (this.elementRef.nativeElement.id !== $event.target['id']) {
      return;
    }
    switch ($event.key) {
      case '0':
      case '1':
      case '2':
      case '3':
      case '4':
      case '5':
      case '6':
      case '7':
      case '8':
      case '9':
        break;
      default:
        $event.preventDefault();
        break;
    }
  }
}
