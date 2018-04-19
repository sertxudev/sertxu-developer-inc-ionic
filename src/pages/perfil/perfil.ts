import { Component } from '@angular/core';
import { NavController, App, LoadingController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { AlertController } from 'ionic-angular';

import { Login } from '../login/login';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'perfil-page',
  templateUrl: 'perfil.html'
})
export class Perfil {

  responseData: any;
  userData = localStorage.getItem('userData');
  jsonUserData = JSON.parse(this.userData);
  userAuth = { "email": "", "token": "" };

  constructor(public navCtrl: NavController, public app: App, public authService: AuthServiceProvider,
    public alertCtrl: AlertController, public loadingCtrl: LoadingController, public translateService: TranslateService) { }

  ionViewWillEnter() {

    let content;
    this.translateService.get('wait').subscribe((res: string) => { content = res; });
    let loading = this.loadingCtrl.create({
      content: content
    });

    if (!this.userData) {
      this.navCtrl.setRoot(Login)
      this.navCtrl.popToRoot()
    } else {
      this.userAuth = { "email": this.jsonUserData.email, "token": this.jsonUserData.token };

      loading.present();

      this.authService.postData(this.userAuth, 'loginToken').then((result) => {
        loading.dismiss();
        if (result) {
          this.responseData = result;
          localStorage.setItem('userData', JSON.stringify(this.responseData));
          this.userData = this.responseData;
        } else {
          this.navCtrl.setRoot(Login)
          this.navCtrl.popToRoot()
        }

      }, (error) => {
        loading.dismiss();
        const alert = this.alertCtrl.create({
          title: 'Error',
          subTitle: 'No se han podido cargar los datos, la información puede no estar actualizada',
          buttons: ['Aceptar']
        });
        alert.present();
        this.userData = JSON.parse(localStorage.getItem('userData'));
      });
    }
  }

  guardar() {
    let title_error, description_error, button_error;
    let content;
    this.translateService.get('wait').subscribe((res: string) => { content = res; });
    let loading = this.loadingCtrl.create({
      content: content
    });
    loading.present();
    let password = false;
    if (this.userData['password']) {
      password = this.userData['password'];
    }
    this.authService.postData({
      "email": this.userData['email'], "nombre": this.userData['name'], "apellidos": this.userData['surname'],
      "phone": this.userData['phone'], "dni": this.userData['dni'], "birthday": this.userData['birthday'], "token": this.jsonUserData.token, "password": password
    }, 'editUser').then((result) => {

      loading.dismiss();
      if (result) {
        this.translateService.get('warning').subscribe((res: string) => { title_error = res; });
        this.translateService.get('user_updated').subscribe((res: string) => { description_error = res; });
        this.translateService.get('accept').subscribe((res: string) => { button_error = res; });
        const alert = this.alertCtrl.create({
          title: title_error,
          subTitle: description_error,
          buttons: [button_error]
        });
        alert.present();
      } else {
        this.logout()
      }

    }, (error) => {
      loading.dismiss();
      const alert = this.alertCtrl.create({
        title: 'Error',
        subTitle: 'No se han podido cargar los datos, la información puede no estar actualizada',
        buttons: ['Aceptar']
      });
      alert.present();
      this.userData = JSON.parse(localStorage.getItem('userData'));
    });
  }

  logout() {
    localStorage.clear();
    this.app.getRootNav().setRoot(Login);
    //setTimeout(() => this.navCtrl.popToRoot(), 1000);
  }

}
