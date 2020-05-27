import { Component, OnInit, ViewChild, ComponentFactoryResolver, Input, Type, EventEmitter, Output } from '@angular/core';
import { ScanDirective } from '../scan.directive';
import { ScannerComponent } from '../scanner/scanner.component';

@Component({
  selector: 'app-add-scanner',
  template: `
  <div class="add-scanner">
    <ng-template appScan></ng-template>
  </div>
`,
})
export class AddScannerComponent implements OnInit {
  @Output() event = new EventEmitter();
  @ViewChild(ScanDirective, {static: true}) appScan: ScanDirective;
  scanner;

  constructor(private componentFactoryResolver: ComponentFactoryResolver) { }

  ngOnInit() {
    this.scanner = ScannerComponent;
    this.loadComponent();
  }

  loadComponent() {
    const componentFactory = this.componentFactoryResolver.resolveComponentFactory(this.scanner);

    const viewContainerRef = this.appScan.viewContainerRef;
    viewContainerRef.clear();

    const componentRef = viewContainerRef.createComponent(componentFactory);

    (componentRef.instance as ScannerComponent).qrResult.subscribe(
      data => {this.event.emit(data); viewContainerRef.clear(); }    
    );
  }
}
