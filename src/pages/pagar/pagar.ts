import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { TranslateService } from '@ngx-translate/core';
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { PayPal, PayPalConfiguration, PayPalPayment } from '@ionic-native/paypal';

@Component({
    selector: 'pagar-page',
    templateUrl: 'pagar.html'
})
export class Pagar {

    sala; dia; detalles; saldo; precio_sala; total_pagar; saldo_restante; errors: boolean = false;

    constructor(public navCtrl: NavController, public navParams: NavParams, public authService: AuthServiceProvider, private payPal: PayPal,
        public translateService: TranslateService, public alertCtrl: AlertController, public loadingCtrl: LoadingController) {
        this.sala = this.navParams.get("sala");
        this.dia = this.navParams.get("dia");
        this.detalles = this.navParams.get("detalles");

        console.log(this.detalles)

        for (let i = 0; i < this.detalles.length; i++) {
            if (this.detalles[i].code == 'error_hour_already_booked') {
                this.errors = true;
            }
        }

        let content;
        this.translateService.get('wait').subscribe((res: string) => { content = res; });
        let loading = this.loadingCtrl.create({
            content: content
        });

        const token = JSON.parse(localStorage.getItem('userData')).token;
        loading.present();

        this.authService.postData({ "token": token }, 'obtainSaldo').then((result) => {
            if (result) {
                this.saldo = parseFloat(result['saldo']);

                this.authService.postData({ "id": this.sala }, 'obtainSala').then((result) => {
                    loading.dismiss();
                    if (result) {
                        this.precio_sala = result['precio'] * this.detalles['length'];
                        const resultado = this.precio_sala - this.saldo;
                        if (resultado > 0) {
                            this.total_pagar = resultado;
                            this.saldo_restante = 0;
                        } else {
                            this.total_pagar = 0;
                            this.saldo_restante = (this.saldo - this.precio_sala);
                        }
                    } else {
                        this.result_error();
                    }
                }, (error) => {
                    loading.dismiss();
                    this.general_error();
                });

            } else {
                loading.dismiss();
                this.result_error();
            }
        }, (error) => {
            loading.dismiss();
            this.general_error();
        });
    }

    pagar() {
        if (this.total_pagar == 0) {
            let content;
            this.translateService.get('wait').subscribe((res: string) => { content = res; });
            let loading = this.loadingCtrl.create({
                content: content
            });
            const token = JSON.parse(localStorage.getItem('userData')).token;

            this.authService.postData({ "token": token, "saldo": this.precio_sala }, 'restarSaldo').then((result) => {
                loading.dismiss();
                if (result) {
                    console.log(result)
                    this.realizarReserva();
                    //this.navCtrl.popToRoot();
                } else {
                    this.result_error();
                }
            }, (error) => {
                loading.dismiss();
                this.general_error();
            });
        } else {
            const precio = (this.precio_sala - this.saldo) + "";
            this.payPal.init({
                PayPalEnvironmentProduction: '',
                PayPalEnvironmentSandbox: ''
            }).then(() => {
                this.payPal.prepareToRender('PayPalEnvironmentSandbox', new PayPalConfiguration({
                })).then(() => {
                    let title_sala;
                    this.translateService.get('sala_' + this.sala).subscribe((res: string) => { title_sala = res; });
                    let payment = new PayPalPayment(precio, 'EUR', 'Reserva ' + title_sala, 'sale');
                    this.payPal.renderSinglePaymentUI(payment).then((result) => {
                        const token = JSON.parse(localStorage.getItem('userData')).token;

                        if (this.saldo > 0) {
                            this.authService.postData({ "token": token, "saldo": this.saldo }, 'restarSaldo').then((result) => {
                                if (result) {
                                    this.realizarReserva();
                                } else {
                                    this.result_error();
                                }
                            }, (error) => {
                                this.general_error();
                            });
                        } else {
                            this.realizarReserva();
                        }

                    }, () => {
                        console.log('Error or render dialog closed without being successful');

                        this.eliminarReserva();
                    });
                }, () => {
                    console.log('Error in configuration');
                    this.eliminarReserva();
                });
            }, () => {
                console.log('Error in initialization, maybe PayPal isn\'t supported or something else');
                this.eliminarReserva();
            });
        }
    }

    realizarReserva() {
        let description_error, button_error;

        let content;
        this.translateService.get('wait').subscribe((res: string) => { content = res; });
        let loading = this.loadingCtrl.create({
            content: content
        });

        loading.present();

        this.authService.postData({ "sala": this.sala, "date": this.dia, "reservas": this.detalles }, 'realizarReserva').then((result) => {
            loading.dismiss();
            if (result) {
                let errors = false;
                for (let i = 0; i < result['length']; i++) {
                    if (result[i]['code'] == 'error_hour_already_booked') {
                        errors = true;
                        this.translateService.get('error_hour_already_booked').subscribe((res: string) => { description_error = res; });
                        this.translateService.get('accept').subscribe((res: string) => { button_error = res; });
                        const alert = this.alertCtrl.create({
                            title: '<h6>' + result[i]['hora'] + ':00</h6>',
                            subTitle: description_error,
                            buttons: [button_error]
                        });
                        alert.present();
                    }
                }

                if (!errors) {
                    let title_error, description_error, button_error;

                    this.translateService.get('warning').subscribe((res: string) => { title_error = res; });
                    this.translateService.get('booked').subscribe((res: string) => { description_error = res; });
                    this.translateService.get('accept').subscribe((res: string) => { button_error = res; });
                    const alert = this.alertCtrl.create({
                        title: title_error,
                        subTitle: description_error,
                        buttons: [button_error]
                    });
                    alert.present();
                    this.navCtrl.popToRoot();
                } else {
                    this.eliminarReserva();
                    let content;
                    this.translateService.get('wait').subscribe((res: string) => { content = res; });
                    let loading = this.loadingCtrl.create({
                        content: content
                    });
                    const token = JSON.parse(localStorage.getItem('userData')).token;

                    this.authService.postData({ "token": token, "saldo": -this.precio_sala }, 'restarSaldo').then((result) => {
                        loading.dismiss();
                        if (result) {

                            let title_error, description_error, button_error;

                            this.translateService.get('warning').subscribe((res: string) => { title_error = res; });
                            this.translateService.get('saldo_devuelto').subscribe((res: string) => { description_error = res; });
                            this.translateService.get('accept').subscribe((res: string) => { button_error = res; });
                            const alert = this.alertCtrl.create({
                                title: title_error,
                                subTitle: description_error,
                                buttons: [button_error]
                            });
                            alert.present()
                            this.navCtrl.pop();
                        } else {
                            this.result_error();
                        }
                    }, (error) => {
                        loading.dismiss();
                        this.general_error();
                    });
                }

            } else {
                this.result_error();
            }
        }, (error) => {
            loading.dismiss();
            this.general_error();
        });
    }

    eliminarReserva() {
        let content;
        this.translateService.get('wait').subscribe((res: string) => { content = res; });
        let loading = this.loadingCtrl.create({
            content: content
        });

        loading.present();

        this.authService.postData({ "reservas": this.detalles }, 'eliminarReserva').then((result) => {
            loading.dismiss();
            if (result) {
                let title_error, description_error, button_error;
        
                this.translateService.get('warning').subscribe((res: string) => { title_error = res; });
                this.translateService.get('booking_removed').subscribe((res: string) => { description_error = res; });
                this.translateService.get('accept').subscribe((res: string) => { button_error = res; });
                const alert = this.alertCtrl.create({
                    title: title_error,
                    subTitle: description_error,
                    buttons: [button_error]
                });
                alert.present();                
            } else {
                this.result_error();
            }
        }, (error) => {
            loading.dismiss();
            this.general_error();
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
