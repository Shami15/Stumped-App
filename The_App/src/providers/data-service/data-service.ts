import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import "rxjs/add/operator/map";
import { Http, Headers } from '@angular/http'
import "rxjs/add/operator/take";
import { Observable } from 'rxjs/Observable';
import { userModel } from '../../app/models/users';
import { ToastController, Events } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { Storage } from '@ionic/storage';
import { TranslateService } from '@ngx-translate/core';
import translation from 'translate';
import _ from 'lodash';

/*
  Generated class for the DataServiceProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class DataServiceProvider {
  public frizbe: any;
  public saucer: any;
  public lang: string;

  // rootUrl : string = "https://shammarlangaignecom.000webhostapp.com";
  // rootUrl: string = "http://localhost:3000";
  rootUrl: string = "http://ec2-3-16-165-84.us-east-2.compute.amazonaws.com:9000";
  file: string = 'classes';
  private currentUser: any;
  public user = [{
    Classes: [
      { "id": "01" }
    ],
    _id: "5b929399eb0bce40acf56649",
    id: 1,
    userName: "shami",
    email: "slangai@email.com",
    password: "YAHYEET",
    fName: "Shammar",
    lName: "Langaigne",
  }];
  public cred: any;
  // file : string = 'pages';
  constructor(public http: Http, public toastCtrl: ToastController, public event: Events, public storage: Storage, public translate: TranslateService) {
    console.log('Hello DataServiceProvider Provider');
  }

  getData() {
    return this.http.get(`${this.rootUrl}/${this.file}`).map(res => res.json()).take(1)
  }

  createClass(dass) {


    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    // console.log(JSON.stringify(body))

    return this.http.post(`${this.rootUrl}/${this.file}`, JSON.stringify(dass), { headers: headers }).map(res => res.json()).subscribe();

  }

  getUser(id) {
    return this.http.get(`${this.rootUrl}/users/${id}`).map(res => res.json()).take(1)
  }

  getClass(id) {
    return this.http.get(`${this.rootUrl}/${this.file}/${id}`).map(res => res.json()).take(1)
  }

  joinClass(id, body) {
    let lang = body.lang;
    _.forEach(body.questions, value => {
      this.bandies(value.topic, lang).then(val => {
        value.topic = val
      });
      this.bandies(value.description, lang).then(val => {
        value.description = val
      });
      // _.forEach(body.comment, comm =>{
      //   this.yandex(comm., )
      // })
    })

    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return this.http.put(`${this.rootUrl}/${this.file}/${id}`, body, { headers: headers }).map(res => res.json()).take(1)
  }

  // async login(cred) {
  //   let body = {
  //     userName : cred.value.userName,
  //     password : cred.value.password
  //   }

  //   let headers = new Headers();
  //   headers.append('Content-Type', 'application/json');

  //   return this.http.post(`${this.rootUrl}/users/login`, JSON.stringify(body), {headers : headers }).map(res => res.json())


  // }

  login(cred) {
    try {
      // let body = {
      //   userName: cred.value.userName,
      //   password: cred.value.password
      // };
      // console.log(JSON.stringify(body));

      let headers = new Headers();
      headers.append('Content-Type', 'application/json');

      return this.http.post(`${this.rootUrl}/users/login`, JSON.stringify(cred), { headers: headers }).map(res => res.json())

      // return body;
    } catch (e) { Promise.reject(e) }

  }

  test(body) {

    try {
      this.login(body).subscribe(allowed => {
        // console.log(JSON.stringify(allowed))
        if (allowed.success) {
          this.cred = allowed;
          allowed.userInfo.password = body.password
          this.publish(allowed.userInfo);
          this.storage.set('cred', allowed);
        } else {
          this.showToast(allowed.msg);
        }
      })
    } catch (e) {
      this.showToast(e);
    }
  }


  public register(cred) {
    let body = {
      id: '21',
      userName: cred.value.userName,
      email: cred.value.email,
      fName: cred.value.fName,
      lName: cred.value.lName,
      password: cred.value.password,
      Classes: [],
    };

    this.trojan(body).subscribe(allowed => {
      if (allowed.success) {
        this.cred = allowed;
        allowed.userInfo.password = body.password
        this.publish(allowed.userInfo);
        this.storage.set('cred', allowed);
      } else {
        this.showToast(allowed.msg);
      }
    },
      error => {
        this.showToast(error);
      });

  }

  trojan(body) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    return this.http.post(`${this.rootUrl}/users/signup`, JSON.stringify(body), { headers: headers }).map(res => res.json())
  }

  public logout() {
    return Observable.create(observer => {
      this.currentUser = null;
      observer.next(true);
      observer.complete();
    });
  }

  showToast(message: string, timeout: number = 8000, position: string = 'buttom') {
    this.toastCtrl.create({
      message: message,
      duration: timeout,
      position: 'bottom'
    }).present();
  }

  publish(user) {
    this.event.publish('user : logged in', user)
  }

  updateUser(user) {
    let body = {
      Classes: this.cred.userInfo.Classes,
      _id: this.cred.userInfo._id,
      id: this.cred.userInfo.id,
      userName: user.value.userName,
      email: user.value.email,
      password: this.cred.userInfo.password,
      fName: user.value.fName,
      lName: user.value.lName,

    }
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    return this.http.put(`${this.rootUrl}/users/${body._id}`, JSON.stringify(body), { headers: headers }).map(res => res.json())
  }

  getStuff() {
    return this.storage.get('cred')
  }

  delete(body) {
    return this.http.delete(`${this.rootUrl}/${this.file}/${body._id}`, JSON.stringify(body)).map(res => res.json())
  }

  translateFunc(param: string) {
    var yeild
    this.translate.get(param).subscribe((res: string) => {
      console.log(res);
      yeild = res
    });
    return yeild
  }

  async yandex(param, lang) {
    let value = await translation(param, { from: lang, to: this.lang, engine: 'yandex', key: 'trnsl.1.1.20181114T194518Z.640236167701ee19.296338b36aa783c4b9a4aee7b5155955c41493ca' }
    ).then(text => {
      console.log(text)
      return text
    });
    return value
  }

  async bandies(param, lang) {
    let value = await translation(param, { from: this.lang, to: lang, engine: 'yandex', key: 'trnsl.1.1.20181114T194518Z.640236167701ee19.296338b36aa783c4b9a4aee7b5155955c41493ca' }
    ).then(text => {
      console.log(text)
      return text
    });
    return value
  }



}
