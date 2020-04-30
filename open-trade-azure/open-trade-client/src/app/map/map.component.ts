import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
/// import {} from '@types/googlemaps';
import { TradeService } from '../trade.service';
import { OidcSecurityService } from 'angular-auth-oidc-client';
import * as atlas from 'azure-maps-control';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  map: atlas.Map;
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
          this.markers = products.map(product => {
              return new atlas.HtmlMarker({
                color: 'DodgerBlue',
                position: [product.location.lng || 40.73061, product.location.lat || 40.73061],
                popup: new atlas.Popup({
                    content: `<div style="padding:10px">${product.source}</div>`,
                    pixelOffset: [0, -30]
                }),
                htmlContent: '<i class="fas fa-map-marker-alt fa-2x" style="color:red"></i>'
             });
          });
        });
      }
    });
  }

  mapInitializer() {
    this.map = new atlas.Map('map', {
        center: [26.1025384, 44.4267674],
        zoom: 5,
        view: 'Auto',
        authOptions: {
            authType: atlas.AuthenticationType.subscriptionKey,
            subscriptionKey: 'Nj6aE_DSvmkSJqABRiLQKA9eyXUaeTkQdG3j1L0FF68'
        },
        style: 'grayscale_dark'
    });
  }

  ngAfterViewInit() {
    this.mapInitializer();

    setTimeout(() => {
      this.loadAllMarkers();
    }, 1500);
  }

  loadAllMarkers(): void {
    // this.markers.forEach(markerInfo => {
    //   const marker = new google.maps.Marker({
    //     ...markerInfo
    //   });

    //   const infoWindow = new google.maps.InfoWindow({
    //     content: marker.getTitle()
    //   });

    //   marker.addListener("click", () => {
    //     infoWindow.open(marker.getMap(), marker);
    //   });

    //   marker.setMap(this.map);
    // });

    this.markers.forEach(marker => {
      this.map.markers.add(marker);
      this.map.events.add('click',marker, () => {
        marker.togglePopup();
      });
    });
  }
}
