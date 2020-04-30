import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-verified',
  templateUrl: './verified.component.html',
  styleUrls: ['./verified.component.scss']
})
export class VerifiedComponent implements OnInit {
  @Input() success;
  constructor() { }

  ngOnInit(): void {
  }

}
