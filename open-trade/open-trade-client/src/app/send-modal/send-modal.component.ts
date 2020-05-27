import { Component, OnInit, Input } from '@angular/core';
import { NgbActiveModal} from '@ng-bootstrap/ng-bootstrap';
import { TradeService } from '../trade.service';
import { FormBuilder } from '@angular/forms';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-send-modal',
  templateUrl: './send-modal.component.html',
  styleUrls: ['./send-modal.component.scss']
})

export class SendModalComponent implements OnInit {
  @Input() productId: string;
  sendForm;
  public response: Observable<string>;
  constructor(public activeModal: NgbActiveModal,private formBuilder: FormBuilder, private tradeService: TradeService) {}

  ngOnInit(): void {
    this.sendForm = this.formBuilder.group({
      destination: ''
    });
  }

  onSubmit(customerData: any) {
    this.tradeService.createTransactionWithDestination(customerData.destination, this.productId).subscribe((data)=>{
      console.log(customerData)
    });
    console.warn('Your order has been submitted', customerData);
    this.close()
  }
  
  close() {
    this.activeModal.close('The modal was closed');
    location.reload();
  }
}
