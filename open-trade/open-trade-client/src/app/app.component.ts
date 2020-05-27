import {Component, OnInit} from '@angular/core';
import {OidcSecurityService} from 'angular-auth-oidc-client';
import {TradeService} from './trade.service';
import {NgbModalOptions, NgbModal} from '@ng-bootstrap/ng-bootstrap';
import {RegistrationModalComponent} from './modal/registration-modal.component';
import {Router} from '@angular/router';
import { NgxNotifierService } from 'ngx-notifier';
import Web3 from 'web3';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'open-trade-client';

  isAuthenticated: boolean;
  userData: any = {email: ''};

  constructor(public router: Router, public oidcSecurityService: OidcSecurityService,
     public tradeService: TradeService, private modalService: NgbModal,
     private ngxNotifierService: NgxNotifierService) {
    const ethEnabled = () => {
      if (window.ethereum) {
        window.web3 = new Web3(window.ethereum);
        window.ethereum.enable();
        return true;
      }
      return false;
    }
    ethEnabled();
  }

  ngOnInit() {
    this.createNotification("New product in pending list. Product name: iPhone 11 Pro. Description: Overpriced phone.", "dark")
    this.oidcSecurityService.getIsAuthorized().subscribe(auth => {
      this.isAuthenticated = auth;
      if (this.isAuthenticated) {
        this.userData = this.oidcSecurityService.getPayloadFromIdToken();
        if (this.isAuthenticated && this.userData) {
          this.tradeService.checkRegister(this.userData.email).subscribe((body) => {
            console.log(body);
            if (body['registered'] == 0) {
              this.showModal(this.userData.email);
            }
          });
        }
      }
    });
  }

  createNotification(message, style){
    this.ngxNotifierService.createToast(message, style, 5000);
}

  showModal(data): void {
    const modalOptions: NgbModalOptions = {
      backdrop: 'static',
      keyboard: false,
      centered: true
    };

    const modalRef = this.modalService.open(RegistrationModalComponent, modalOptions);
    modalRef.componentInstance.email = data;
    modalRef.result.then((result) => {
      console.log(`Closed with: ${result}`);
    }, (reason) => {
      console.log(`Dismissed ${reason}`);
    });
  }

  login() {
    this.oidcSecurityService.authorize();
  }

  logout() {
    this.oidcSecurityService.logoff();
    this.router.navigate(['/home']);
  }

}
