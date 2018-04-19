import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { TranslateService } from '@ngx-translate/core';
import { Pagar } from '../pagar/pagar';

@Component({
	selector: 'horario-page',
	templateUrl: 'horario.html'
})

export class Horario {

	checks = [];
	reservadas = [];

	constructor(public navCtrl: NavController, public navParams: NavParams, public authService: AuthServiceProvider,
		public translateService: TranslateService, public alertCtrl: AlertController, public loadingCtrl: LoadingController) {

		let title_error, description_error, button_error;

		let content;
		this.translateService.get('wait').subscribe((res: string) => { content = res; });
		let loading = this.loadingCtrl.create({
			content: content
		});

		loading.present();

		this.authService.postData({ "date": navParams.get("date"), "sala": navParams.get("sala") }, 'obtainHoras').then((result) => {
			loading.dismiss();
			if (result) {
				console.log(result);
				let fecha_inicial, fecha_final;
				this.reservadas = [];

				if (result['length'] == 0) {
					this.reservadas.push({ "hora": false });
				} else {
					for (let l = 0; l < result['length']; l++) {
						fecha_inicial = new Date(result[l]['fecha_inicial']).getHours();
						fecha_final = new Date(result[l]['fecha_final']).getHours();
						//this.print(fecha_inicial.getHours(), fecha_final.getHours());
						for (let i = 0; i < 24; i++) {
							if (i >= fecha_inicial && i <= fecha_final) {
								this.reservadas.push({ "hora": i });
							}
						}
					}
				}
				this.print(this.reservadas);
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
			loading.dismiss();
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

	reservar() {
		let selected = [];
		for (let i = 0; i < 24; i++) {
			if (this.checks[i]['select']) {
				selected.push(this.checks[i])
			}
		}

		if (selected.length) {
			let title_error, description_error, button_error;

			let content;
			this.translateService.get('wait').subscribe((res: string) => { content = res; });
			let loading = this.loadingCtrl.create({
				content: content
			});

			loading.present();

			const token = JSON.parse(localStorage.getItem('userData')).token;

			this.authService.postData({ "token": token, "sala": this.navParams.get("sala"), "date": this.navParams.get("date"), "hora": selected }, 'realizarPrereserva').then((result) => {
				loading.dismiss();
				if (result) {
					this.navCtrl.push(Pagar, {
						"sala": this.navParams.get("sala"),
						"dia": this.navParams.get("date"),
						"detalles": result
					});

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
				loading.dismiss();
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

		}else{
			let title_error, description_error, button_error;
			this.translateService.get('error').subscribe((res: string) => { title_error = res; });
			this.translateService.get('no_hours_selected').subscribe((res: string) => { description_error = res; });
			this.translateService.get('accept').subscribe((res: string) => { button_error = res; });
			const alert = this.alertCtrl.create({
				title: title_error,
				subTitle: description_error,
				buttons: [button_error]
			});
			alert.present();
		}

	}

	print(hora) {
		for (let i = 0; i < 24; i++) {
			for (let l = 0; l < hora['length']; l++) {
				if (hora[l]['hora'] === i) {
					this.checks.push({
						"hora": i,
						"bloqueado": true
					});
					break;
				} else if (l === hora['length'] - 1) {
					this.checks.push({
						"hora": i,
						"bloqueado": false
					});
				}
			}
		}
	}

}
