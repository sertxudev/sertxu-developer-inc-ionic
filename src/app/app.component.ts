import { Component } from '@angular/core';
import { Platform } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AlertController } from 'ionic-angular';

import { AuthServiceProvider } from '../providers/auth-service/auth-service';
import { Globalization } from '@ionic-native/globalization';
import { TranslateService } from '@ngx-translate/core';

import { Login } from '../pages/login/login';
import { Tabs } from '../pages/tabs/tabs';

@Component({
  templateUrl: 'app.html'
})
export class App {
  rootPage = null;

  userData = localStorage.getItem('userData');
  jsonUserData = JSON.parse(this.userData);
  userAuth = { "email": "", "token": "" };
  responseData: any;

  constructor(public platform: Platform, public statusBar: StatusBar, public splashScreen: SplashScreen, public translate: TranslateService, public globalization: Globalization, public authService: AuthServiceProvider, public alertCtrl: AlertController) {
    //translate.setDefaultLang('en');
    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();

      this.globalization.getPreferredLanguage().then((res) => {
        this.translate.setDefaultLang('en')
        this.translate.use(res.value.split("-", 1)[0]);
      }).catch((error) => {
      });

      if (this.userData) {
        this.userData = localStorage.getItem('userData');
        this.userAuth = { "email": this.jsonUserData.email, "token": this.jsonUserData.token };
        this.authService.postData(this.userAuth, 'loginToken').then((result) => {
          if (result) {
            this.responseData = result;
            localStorage.setItem('userData', JSON.stringify(this.responseData));
            this.rootPage = Tabs;
          } else {
            this.rootPage = Login;
          }

        }, (error) => {
          const alert = this.alertCtrl.create({
            title: 'Error',
            subTitle: 'Se ha producido un error inesperado, inténtelo más tarde',
            buttons: ['Aceptar']
          });
          alert.present();
          this.rootPage = Tabs;
        });
      } else {
        this.rootPage = Login;
      }
      splashScreen.hide();
    });
  }
}
