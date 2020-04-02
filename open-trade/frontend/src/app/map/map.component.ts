import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
/// import {} from '@types/googlemaps';
import { TradeService } from '../trade.service';
import { OidcSecurityService } from 'angular-auth-oidc-client';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  map: google.maps.Map;
  @ViewChild('mapContainer', {static: false}) gmap: ElementRef;
  lat = 44.4267674;
  lng = 26.1025384;
  coordinates = new google.maps.LatLng(this.lat, this.lng);
  mapOptions: google.maps.MapOptions = {
    center: this.coordinates,
    zoom: 5,
  };
  isAuthenticated: boolean;
  markers: any = null;

  constructor(public oidcSecurityService: OidcSecurityService, public tradeService: TradeService) { }

  ngOnInit(): void {
    this.oidcSecurityService.getIsAuthorized().subscribe(auth => {
      this.isAuthenticated = auth;

      if (this.isAuthenticated) {
        this.tradeService.getSentProducts().subscribe((products) => {
          this.markers = products.map(product => ({
            position: new google.maps.LatLng(
              product.location.lat || 40.73061, 
              product.location.lng || -73.947512
            ),
            map: this.map,
            title: product.source
          }));
        })
      }
    });
  }

  mapInitializer() {
    this.map = new google.maps.Map(this.gmap.nativeElement, 
    this.mapOptions);
  }

  ngAfterViewInit() {
    this.mapInitializer();

    setTimeout(() => {
      this.loadAllMarkers();
    }, 1500);
  }

  loadAllMarkers(): void {
    this.markers.forEach(markerInfo => {
      const marker = new google.maps.Marker({
        ...markerInfo
      });

      const infoWindow = new google.maps.InfoWindow({
        content: marker.getTitle()
      });

      marker.addListener("click", () => {
        infoWindow.open(marker.getMap(), marker);
      });

      marker.setMap(this.map);
    });
  }
}
