import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[appScan]'
})
export class ScanDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
