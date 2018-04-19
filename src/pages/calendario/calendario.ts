import { Component } from '@angular/core';
import { NavController, AlertController, NavParams, LoadingController } from 'ionic-angular';
import { CalendarComponentOptions, DayConfig } from "ion2-calendar";
import { AuthServiceProvider } from '../../providers/auth-service/auth-service';
import { TranslateService } from '@ngx-translate/core';
import { Horario } from '../horario/horario';

@Component({
  selector: 'calendario-page',
  templateUrl: 'calendario.html'
})

export class Calendario {

  dia = new Date();
  options;
  _daysConfig: DayConfig[] = [];

  constructor(public navCtrl: NavController, public authService: AuthServiceProvider, public alertCtrl: AlertController,
    public translateService: TranslateService, public navParams: NavParams, public loadingCtrl: LoadingController) {
    const today = new Date();
    this.obtainFiestas(today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate());
  }

  onChange($event) {
    this.navCtrl.push(Horario, {
      "sala": this.navParams.get("sala"),
      "date": $event
    });
  }

  monthChange($event) {
    this.obtainFiestas($event.newMonth.string);
  }

  build() {
    const options: CalendarComponentOptions = {
      daysConfig: this._daysConfig,
      monthPickerFormat: ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'],
      monthFormat: 'MMM YYYY',
      weekdays: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
      weekStart: 1,
      disableWeeks: [0]
    };

    this.options = options;
  }

  obtainFiestas(month) {

    let title_error, description_error, button_error, label_title;

    let content;
    this.translateService.get('wait').subscribe((res: string) => { content = res; });
    let loading = this.loadingCtrl.create({
      content: content
    });

    loading.present();

    this.authService.postData({ "date": month }, 'obtainFiestas').then((result) => {
      loading.dismiss();
      if (result) {

        for (let i = 0; i < result['length']; i++) {

          this.translateService.get(result[i]['label'].toLowerCase()).subscribe((res: string) => { label_title = res; });

          this._daysConfig.push({
            date: new Date(result[i]['anno'], (result[i]['mes'] - 1), result[i]['dia']),
            subTitle: label_title,
            disable: true,
            cssClass: result[i]['label'].toLowerCase()
          });

        }
        this.build();

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

    this._daysConfig.push({
      date: new Date(),
      disable: true
    });

  }

}
