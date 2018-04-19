import { Component } from '@angular/core';
import { NavController } from 'ionic-angular';

import { Inicio } from '../inicio/inicio';
import { Salas } from '../salas/salas';
import { Contratado } from '../contratado/contratado';

@Component({
  templateUrl: 'tabs.html'
})
export class Tabs {

  tab1 = Inicio;
  tab2 = Salas;
  tab3 = Contratado;

  constructor(public navCtrl: NavController) { }

}
