import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

@Component({
  selector: 'contratado-page',
  templateUrl: 'contratado.html'
})
export class Contratado {
  
  reservas;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public authService: AuthServiceProvider,
		public translateService: TranslateService) {
      this.reload();
	}
	
	
	ionViewWillEnter(){
		this.reload()
	}

  reload(){
    let title_error, description_error, button_error;
    
    this.authService.postData({"token": JSON.parse(localStorage.getItem('userData')).token}, 'obtainReservas').then((result) => {
			if (result) {
        this.reservas = result;
			} else {
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
		}, (error) => {
			this.translateService.get('error').subscribe((res: string) => { title_error = res; });
			this.translateService.get('general_error').subscribe((res: string) => { description_error = res; });
			this.translateService.get('accept').subscribe((res: string) => { button_error = res; });
			const alert = this.alertCtrl.create({
				title: title_error,
				subTitle: description_error,
				buttons: [button_error]
			});
			alert.present();
		});
  }
}
