import { Component } from '@angular/core';
import { NavController, AlertController, LoadingController } from 'ionic-angular';

import { Calendario } from '../calendario/calendario';
import { TranslateService } from '@ngx-translate/core';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

@Component({
  selector: 'salas-page',
  templateUrl: 'salas.html'
})
export class Salas {
  userData = { "email": "", "password": "" };

  salas;

  constructor(public navCtrl: NavController, public authService: AuthServiceProvider,
    public translateService: TranslateService, public alertCtrl: AlertController, public loadingCtrl: LoadingController) {

    let title_error, description_error, button_error;

    let content;
    this.translateService.get('wait').subscribe((res: string) => { content = res; });
    let loading = this.loadingCtrl.create({
      content: content
    });

    loading.present();

    this.authService.postData({}, 'obtainSalas').then((result) => {
      loading.dismiss();
      if (result) {
        this.salas = result;
      } else {
        this.result_error();
      }
    }, (error) => {
      loading.dismiss();
      this.general_error();
    });
  }

  saldo() {
    let content;
    this.translateService.get('wait').subscribe((res: string) => { content = res; });
    let loading = this.loadingCtrl.create({
      content: content
    });

    const token = JSON.parse(localStorage.getItem('userData')).token;
    loading.present();

    this.authService.postData({ "token": token }, 'obtainSaldo').then((result) => {
      loading.dismiss();
      if (result) {
        const saldo = parseFloat(result['saldo']);

        let title_error, description_error, button_error;
        this.translateService.get('balance').subscribe((res: string) => { title_error = res; });
        this.translateService.get('accept').subscribe((res: string) => { button_error = res; });
        const alert = this.alertCtrl.create({
          title: title_error,
          subTitle: saldo + " €",
          buttons: [button_error]
        });
        alert.present();

      } else {
        loading.dismiss();
        this.result_error();
      }
    }, (error) => {
      loading.dismiss();
      this.general_error();
    });

  }

  show(id) {
    this.navCtrl.push(Calendario, {
      "sala": id,
    });
  }

  result_error() {
    let title_error, description_error, button_error;

    this.translateService.get('warning').subscribe((res: string) => { title_error = res; });
    this.translateService.get('result_error').subscribe((res: string) => { description_error = res; });
    this.translateService.get('accept').subscribe((res: string) => { button_error = res; });
    const alert = this.alertCtrl.create({
      title: title_error,
      subTitle: description_error,
      buttons: [button_error]
    });
    alert.present();
  }

  general_error() {
    let title_error, description_error, button_error;

    this.translateService.get('error').subscribe((res: string) => { title_error = res; });
    this.translateService.get('general_error').subscribe((res: string) => { description_error = res; });
    this.translateService.get('accept').subscribe((res: string) => { button_error = res; });
    const alert = this.alertCtrl.create({
      title: title_error,
      subTitle: description_error,
      buttons: [button_error]
    });
    alert.present();
  }

}
