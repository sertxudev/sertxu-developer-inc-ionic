import { Component } from '@angular/core';
import { NavController, App, LoadingController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { AlertController } from 'ionic-angular';

import { TranslateService } from '@ngx-translate/core';

import { Tabs } from '../tabs/tabs';
import { Registro } from '../registro/registro';

@Component({
  selector: 'login-page',
  templateUrl: 'login.html'
})
export class Login {

  responseData: any;
  userData = { "email": "", "password": "" };
  title_error;
  description_error;
  button_error;

  constructor(public navCtrl: NavController, public app: App, public authService: AuthServiceProvider,
    public alertCtrl: AlertController, public translateService: TranslateService, public loadingCtrl: LoadingController) { }

  login() {
    if (this.userData.email && this.userData.password) {

      let content;
      this.translateService.get('wait').subscribe((res: string) => { content = res; });
      let loading = this.loadingCtrl.create({
        content: content
      });

      loading.present();
      this.authService.postData(this.userData, 'loginUser').then((result) => {
        loading.dismiss();
        if (result) {
          this.responseData = result;
          localStorage.setItem('userData', JSON.stringify(this.responseData));
          this.navCtrl.setRoot(Tabs)
          this.navCtrl.popToRoot()
        } else {
          this.translateService.get('warning').subscribe((res: string) => { this.title_error = res; });
          this.translateService.get('login_error').subscribe((res: string) => { this.description_error = res; });
          this.translateService.get('accept').subscribe((res: string) => { this.button_error = res; });
          const alert = this.alertCtrl.create({
            title: this.title_error,
            subTitle: this.description_error,
            buttons: [this.button_error]
          });
          alert.present();
        }
      }, (error) => {
        loading.dismiss();
        this.translateService.get('error').subscribe((res: string) => { this.title_error = res; });
        this.translateService.get('general_error').subscribe((res: string) => { this.description_error = res; });
        this.translateService.get('accept').subscribe((res: string) => { this.button_error = res; });
        const alert = this.alertCtrl.create({
          title: this.title_error,
          subTitle: this.description_error,
          buttons: [this.button_error]
        });
        alert.present();
      });
    }
  }

  registrarse() {
    this.navCtrl.push(Registro);
  }

}