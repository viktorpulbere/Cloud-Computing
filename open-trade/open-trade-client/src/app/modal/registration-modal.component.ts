import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { TradeService } from '../trade.service';
import { FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'concurrency-modal',
  templateUrl: './registration-modal.component.html',
  styleUrls: [ './registration-modal.component.scss'],
})
export class RegistrationModalComponent implements OnInit {
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
    this.tradeService.getLatLongMicrosoft(customerData.address).subscribe((data) => {
      if (data.results) {
        // let location = data.results[0].geometry.location;
        let location = data.results[0].position;
        console.log(location)
        this.tradeService.createUser(location.lat, 
          location.lon, this.email,customerData.name ).subscribe((data)=>{
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
