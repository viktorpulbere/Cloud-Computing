import {BrowserModule} from '@angular/platform-browser';
import {APP_INITIALIZER, NgModule} from '@angular/core';

import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './app.component';

import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {
  AuthModule,
  ConfigResult,
  OidcConfigService,
  OidcSecurityService,
  OpenIdConfiguration
} from 'angular-auth-oidc-client';
import {HomeComponent} from './home/home.component';
import {DashboardComponent} from './dashboard/dashboard.component';
import {AuthInterceptor} from "./auth.interceptor";
import {NgbModule, NgbPaginationModule} from '@ng-bootstrap/ng-bootstrap';
import { CreateComponent } from './create/create.component';
import { MapComponent } from './map/map.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ConcurrencyModalComponent } from './concurrency-modal/concurrency-modal.component';
import { SendModalComponent } from './send-modal/send-modal.component';


const oidcConfiguration = 'assets/oidcConfig.json';

export function loadConfig(oidcConfigService: OidcConfigService) {
  return () => oidcConfigService.load(oidcConfiguration);
}

@NgModule({
  declarations: [
    AppComponent,
    HomeComponent,
    DashboardComponent,
    CreateComponent,
    MapComponent,
    ConcurrencyModalComponent,
    SendModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    AuthModule.forRoot(),
    NgbModule,
    NgbPaginationModule,
    FormsModule,
    ReactiveFormsModule 
  ],
  providers: [
    OidcConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: loadConfig,
      deps: [OidcConfigService],
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private oidcSecurityService: OidcSecurityService, private oidcConfigService: OidcConfigService) {
    this.oidcConfigService.onConfigurationLoaded.subscribe((configResult: ConfigResult) => {

      const config: OpenIdConfiguration = {
        stsServer: configResult.customConfig.stsServer,
        redirect_url: configResult.customConfig.redirect_url,
        client_id: configResult.customConfig.client_id,
        scope: configResult.customConfig.scope,
        response_type: configResult.customConfig.response_type,
        silent_renew: false,
        log_console_debug_active: configResult.customConfig.log_console_debug_active,
        post_login_route: configResult.customConfig.post_login_route,
        forbidden_route: configResult.customConfig.forbidden_route,
        unauthorized_route: configResult.customConfig.forbidden_route
      };

      this.oidcSecurityService.setupModule(config, configResult.authWellknownEndpoints);
    });
  }
}
