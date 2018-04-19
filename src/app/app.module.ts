import { NgModule, ErrorHandler } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { App } from './app.component';

import { Inicio } from '../pages/inicio/inicio';
import { Login } from '../pages/login/login';
import { Registro } from '../pages/registro/registro';
import { Salas } from '../pages/salas/salas';
import { Contratado } from '../pages/contratado/contratado';
import { Perfil } from '../pages/perfil/perfil';
import { Tabs } from '../pages/tabs/tabs';
import { Calendario } from '../pages/calendario/calendario';
import { Horario } from '../pages/horario/horario';
import { Pagar } from '../pages/pagar/pagar';

//import { SignaturePadModule } from 'angular2-signaturepad';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AuthServiceProvider } from '../providers/auth-service/auth-service';

import { Globalization } from '@ionic-native/globalization';

import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';

import { FormsModule } from '@angular/forms';
import { CustomFormsModule } from 'ng2-validation';

import { PayPal } from '@ionic-native/paypal';
import { CalendarModule } from "ion2-calendar";


export function setTranslateLoader(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/lang/', '.json');
}

@NgModule({
  declarations: [
    App,
    Inicio,
    Login,
    Registro,
    Contratado,
    Salas,
    Perfil,
    Tabs,
    Calendario,
    Horario,
    Pagar
  ],
  imports: [
    BrowserModule,
    HttpModule,
    IonicModule.forRoot(App),
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: (setTranslateLoader),
        deps: [HttpClient]
      }
    }),
    FormsModule, 
    CustomFormsModule,
    CalendarModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    App,
    Inicio,
    Login,
    Registro,
    Contratado,
    Salas,
    Perfil,
    Tabs,
    Calendario,
    Horario,
    Pagar
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Globalization,
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    AuthServiceProvider,
    PayPal
  ]
})
export class AppModule {}
