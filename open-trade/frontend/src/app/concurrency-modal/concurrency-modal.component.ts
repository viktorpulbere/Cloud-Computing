import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { TradeService } from '../trade.service';
import { FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'concurrency-modal',
  templateUrl: './concurrency-modal.component.html',
  styleUrls: [ './concurrency-modal.component.scss'],
})
export class ConcurrencyModalComponent implements OnInit {
  checkoutForm;
  @Input() email;
  public response: Observable<string>;
  constructor(public activeModal: NgbActiveModal,private formBuilder: FormBuilder, private tradeService: TradeService) {}

  ngOnInit(): void {
    this.checkoutForm = this.formBuilder.group({
      name: '',
      address: ''
    });
   }

  onSubmit(customerData: any) {
    console.log(customerData);
    this.tradeService.getLatLong(customerData.address).subscribe((data) => {
      if (data.status == 'OK') {
        let location = data.results[0].geometry.location;
        console.log(location)
        this.tradeService.createUser(location.lat, 
          location.lng, this.email,customerData.name ).subscribe((data)=>{
          console.log(customerData)
        });
        console.warn('Your order has been submitted', customerData);
        this.close()
      }
    })
  }
  
  close() {
    this.activeModal.close('The modal was closed');
    location.reload();
  }
}
