import {Component, OnInit} from '@angular/core';
import {NgxSpinnerService} from 'ngx-spinner';
import {TradeService} from '../trade.service';
import {config} from '../../config';

@Component({
  selector: 'app-scan',
  templateUrl: './scan.component.html',
  styleUrls: ['./scan.component.scss']
})
export class ScanComponent implements OnInit {
  btnScanClicked = true
  showModal: boolean = false;
  qrCode: string
  trace = []
  success = false

  constructor(public tradeService: TradeService, public spinner: NgxSpinnerService) {
  }

  ngOnInit(): void {
    this.spinner.show();
    this.tradeService.getLatLong("Vaslui, Romania").subscribe(data => {
      console.log(data);
    })
  }

  afterScan(event) {
    this.btnScanClicked = false;
    this.showModal = true;
    this.qrCode = event
    console.log(this.qrCode)
    var self = this
    this.tradeService.getProductTrace(this.qrCode).subscribe(async (data) => {
      if (data.length) {
        if (data.length > 2) {
          data = data.slice(1)
        }
        data.forEach(function (element) {
          self.tradeService.getAddressMicrosoft(element.location.lat, element.location.lng).subscribe(address => {
            console.log(address)
            element.address = address.addresses[0].address.freeformAddress
          });
        });

        if (data[data.length - 1].destination)
          data[data.length - 1].source = data[data.length - 1].destination

        const accounts = await window.web3.eth.getAccounts();
        console.log('App account eth: ', Number.parseFloat(await window.web3.eth.getBalance(accounts[0]) / 1e18).toFixed(2));

        const contract = new window.web3.eth.Contract(JSON.parse(config.abi), config.contract_address, {
          from: accounts[0],
          gas: 3000000
        });

        for (let i = 0; i < data.length; ++i) {
          try {
            if (data[i] && data[i].productId) {
              const dataFromBc = contract.methods.getTransaction(data[i].productId, i).call();
              console.log(data[i]);
              const blockchainData = JSON.stringify({source: dataFromBc.source, destination: dataFromBc.destination});
              const msgUint8 = new TextEncoder().encode(blockchainData);
              const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
              const hashArray = Array.from(new Uint8Array(hashBuffer));
              const hashHex = hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
              console.log(hashHex);
            }
          } catch (e) {
            console.error(e);
          }
        }

        setTimeout(() => {
          self.trace = data;
          console.log(self.trace)
        }, 500)

        setTimeout(() => {
          this.success = true
        }, 1000)

      }
    })
  }

  scan() {
    this.spinner.hide();
  }
}
