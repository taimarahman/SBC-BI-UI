// Angular modules
import { HttpClient } from '@angular/common/http';
import { HttpClientModule } from '@angular/common/http';
import {APP_INITIALIZER, CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import { NgModule } from '@angular/core';
import { Injector } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { CommonModule, DatePipe } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';

// External modules
import { TranslateService } from '@ngx-translate/core';
import { TranslateModule } from '@ngx-translate/core';
import { TranslateLoader } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

// Internal modules
import { AppRoutingModule } from './app-routing.module';
import { SharedModule } from './shared/shared.module';
import { StaticModule } from './static/static.module';

// Services
import { AppService } from '@services/app.service';
import { StoreService } from '@services/store.service';

// Components
import { AppComponent } from './app.component';

// Factories
import { appInitFactory } from '@factories/app-init.factory';
import { FormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbPaginationModule } from '@ng-bootstrap/ng-bootstrap';
import { Select2Module } from 'ng-select2-component';
import { NgChartsModule } from 'ng2-charts';
import {HomeModule} from "./pages/home/home.module";
import {NgxSpinnerModule} from "ngx-spinner";
// import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';

@NgModule({
    imports: [
        // Angular modules
        HttpClientModule,
        BrowserAnimationsModule,
        BrowserModule,
        FormsModule,
        Select2Module,
        NgbPaginationModule,
        NgChartsModule,
        CommonModule,
        ToastrModule.forRoot(),
        // External modules
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: createTranslateLoader,
                deps: [HttpClient],
            },
        }),

        // Internal modules
        SharedModule,
        // StaticModule,
        AppRoutingModule,
        NgbModule,
        HomeModule,
        NgxSpinnerModule,
        // FontAwesomeModule,
    ],
  schemas: [CUSTOM_ELEMENTS_SCHEMA],
  declarations: [AppComponent,],
  providers: [
    // External modules
    {
      provide: APP_INITIALIZER,
      useFactory: appInitFactory,
      deps: [TranslateService, Injector],
      multi: true,
    },

    // Services
    AppService,
    StoreService,

    // Pipes
    DatePipe,

    // Guards

    // Interceptors
  ],
  exports: [
    // NavBarComponent,
    // FooterComponent
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}

export function createTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}
