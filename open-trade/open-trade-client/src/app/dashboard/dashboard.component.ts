import {Component, OnInit} from '@angular/core';
import {Observable} from "rxjs";
import {HttpClient} from "@angular/common/http";
import {map} from "rxjs/operators";
import { TradeService } from '../trade.service';
import { NgbModalOptions, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { SendModalComponent } from '../send-modal/send-modal.component';
import { FormGroup, FormBuilder, FormArray } from '@angular/forms';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {

  public response: Observable<string>;

  page = 1;
  pageSize = 3;
  collectionSize;
  countries;
  allCountries;
  checkoutForm;
  stars = 5;


  constructor(private http: HttpClient, private tradeService: TradeService, private modalService: NgbModal, private formBuilder: FormBuilder) {
    this.checkoutForm = this.formBuilder.group({
      source: '',
      feedback: '',
    });
  }

  onSubmit(customerData: any) {
    console.log(customerData)
    this.checkoutForm.reset();
    this.tradeService.submitRatingForProduct(customerData.source, this.stars, customerData.feedback).subscribe((response)=>{
    });
    console.warn('Your order has been submitted', customerData);
  }

  ngOnInit(): void {
    this.tradeService.getTransactions(1).subscribe((countries) => {
      console.log(countries)
      this.collectionSize = countries.length
      this.allCountries = countries.map((country, i) => ({id: i + 1, ...country}))
      this.countries = this.allCountries.slice((this.page - 1) * this.pageSize, (this.page - 1) * this.pageSize + this.pageSize);
    })
  }

  showModal(data): void {
    const modalOptions: NgbModalOptions = {
        backdrop : false,
        keyboard : false,
        centered: true
      };
      
      const modalRef = this.modalService.open(SendModalComponent, modalOptions);
      modalRef.componentInstance.email = data;
      modalRef.result.then((result) => {
        console.log(`Closed with: ${result}`);
      }, (reason) => {
        console.log(`Dismissed ${reason}`);
    });
  }

  pick(productId): void {
    this.tradeService.createTransactionWithoutDestination(productId).subscribe((result) => {
      console.log(result);
      location.reload();
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

  onRatingSet(event) {
    this.stars = event;
}
}
