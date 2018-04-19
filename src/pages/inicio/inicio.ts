import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';
import { AlertController } from 'ionic-angular';

import { Perfil } from '../perfil/perfil';
import { TranslateService } from '@ngx-translate/core';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';

@Component({
  selector: 'inicio-page',
  templateUrl: 'inicio.html'
})
export class Inicio {

  noticias;

  constructor(public navCtrl: NavController, public alertCtrl: AlertController, public authService: AuthServiceProvider,
		public translateService: TranslateService) {
			this.actualizar();
  }

  perfil() {
    this.navCtrl.push(Perfil);
	}
	
	ionViewWillEnter(){
		this.actualizar()
	}
	
	actualizar(){		
    let title_error, description_error, button_error;
    
    this.authService.postData({}, 'obtainNews').then((result) => {
			if (result) {
        this.noticias = result;
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
