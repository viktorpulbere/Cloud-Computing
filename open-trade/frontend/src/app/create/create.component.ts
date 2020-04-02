import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { FormBuilder } from '@angular/forms';
import { TradeService } from '../trade.service';
import { NgbModalOptions, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SendModalComponent } from '../send-modal/send-modal.component';


@Component({
  selector: 'app-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CreateComponent implements OnInit {
  public response: Observable<string>;
  checkoutForm;
  items;
  allCountries;


  page = 1;
  pageSize = 5;
  collectionSize;
  countries;

  constructor(private http: HttpClient, private formBuilder: FormBuilder, private tradeService: TradeService, private modalService: NgbModal) {
    this.checkoutForm = this.formBuilder.group({
      name: '',
      description: ''
    });
  }

  onSubmit(customerData: any) {
    console.log(customerData)
    this.checkoutForm.reset();
    this.tradeService.createProduct(customerData.name, customerData.description).subscribe((response)=>{
      this.tradeService.createTransactionWithoutDestination(response.productId).subscribe((data) => {
        console.log(data);
        location.reload();
      })
    });
    console.warn('Your order has been submitted', customerData);
  }

  ngOnInit(): void {
    this.tradeService.getTransactions(0).subscribe((countries) => {
      console.log(countries)
      this.collectionSize = countries.length
      this.allCountries = countries.map((country, i) => ({id: i + 1, ...country}))
      this.countries = this.allCountries.slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
    })
  }

  showModal(data): void {
    const modalOptions: NgbModalOptions = {
        backdrop : 'static',
        keyboard : false,
        centered: true
      };
      
      const modalRef = this.modalService.open(SendModalComponent, modalOptions);
      modalRef.componentInstance.productId = data;
      modalRef.result.then((result) => {
        console.log(`Closed with: ${result}`);
      }, (reason) => {
        console.log(`Dismissed ${reason}`);
    });
  }

  pageChanged(page) {
    this.page = page;
    console.log('Page changed: ' + page);
    console.log(this.countries)
    this.countries = this.allCountries.slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
        console.log("Countries" + this.countries)

    console.log((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize)
    console.log(this.countries)
  }
  
}
  