import { Component } from '@angular/core';
import { NavController, App, LoadingController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { AlertController } from 'ionic-angular';

import { TranslateService } from '@ngx-translate/core';

import { Tabs } from '../tabs/tabs';

@Component({
  selector: 'registro-page',
  templateUrl: 'registro.html'
})
export class Registro {

  responseData: any;
  userData = { "nombre": "", "apellidos": "", "email": "", "password": "", "phone": "", "dni": "", "birthday": "" };
  title_error;
  description_error;
  button_error;

  constructor(public app: App, public navCtrl: NavController, public authService: AuthServiceProvider,
    public alertCtrl: AlertController, public translateService: TranslateService, public loadingCtrl: LoadingController) { }

  register() {

    if (this.userData.nombre && this.userData.apellidos && this.userData.email && this.userData.password
      && this.userData.phone && this.userData.dni && this.userData.birthday) {

      let content;
      this.translateService.get('wait').subscribe((res: string) => { content = res; });
      let loading = this.loadingCtrl.create({
        content: content
      });

      loading.present();
      this.authService.postData(this.userData, 'registerUser').then((result) => {
        loading.dismiss();
        if (result) {
          localStorage.setItem('userData', JSON.stringify(result));
          this.navCtrl.setRoot(Tabs);
          this.navCtrl.popToRoot();
        } else {
          this.translateService.get('error').subscribe((res: string) => { this.title_error = res; });
          this.translateService.get('register_error').subscribe((res: string) => { this.description_error = res; });
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
    } else {
      this.translateService.get('error').subscribe((res: string) => { this.title_error = res; });
      this.translateService.get('inputs_empty').subscribe((res: string) => { this.description_error = res; });
      this.translateService.get('accept').subscribe((res: string) => { this.button_error = res; });
      const alert = this.alertCtrl.create({
        title: this.title_error,
        subTitle: this.description_error,
        buttons: [this.button_error]
      });
      alert.present();
    }
  }

}
