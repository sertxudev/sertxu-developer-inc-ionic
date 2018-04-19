import { Injectable } from '@angular/core';
import { Http, Headers } from '@angular/http';
import 'rxjs/add/operator/map';

/*
  Generated class for the AuthServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
let apiUrl = 'https://business.sertxudeveloper.com/api/?r=';

@Injectable()
export class AuthServiceProvider {

  constructor(public http: Http) { }

  postData(credentials, action) {
    return new Promise((resolve, reject) => {
      let headers = new Headers();
      console.log(apiUrl + action + ', ' + JSON.stringify(credentials));
      this.http.post(apiUrl + action, JSON.stringify(credentials), {headers: headers})
        .subscribe(res => {
          resolve(res.json());
        }, (err) => {
          reject(err);
        });
    });

  }

}
