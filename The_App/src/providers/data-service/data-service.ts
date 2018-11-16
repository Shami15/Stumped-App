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
  public frizbe: any;//parsing data to pages
  public saucer: any;//parsing data to pages
  public lang: string;//language the user set

  // rootUrl : string = "https://shammarlangaignecom.000webhostapp.com";
  // rootUrl: string = "http://localhost:3000";
  rootUrl: string = "http://ec2-3-16-165-84.us-east-2.compute.amazonaws.com:9000";
  file: string = 'classes';
  private currentUser: any;
  // public user = [{
  //   Classes: [
  //     { "id": "01" }
  //   ],
  //   _id: "5b929399eb0bce40acf56649",
  //   id: 1,
  //   userName: "shami",
  //   email: "slangai@email.com",
  //   password: "YAHYEET",
  //   fName: "Shammar",
  //   lName: "Langaigne",
  // }];
  public cred: any;//user credentials
  // file : string = 'pages';
  constructor(public http: Http, public toastCtrl: ToastController, public event: Events, public storage: Storage, public translate: TranslateService) {
    console.log('Hello DataServiceProvider Provider');
  }

  //retrieving data from the backend
  getData() {
    try {
      return this.http.get(`${this.rootUrl}/${this.file}`).map(res => res.json()).take(1)
    } catch (e) {
      this.showToast(e)
    }
  }

  //functions posts new class to the backend
  createClass(dass) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');

    try {
      return this.http.post(`${this.rootUrl}/${this.file}`, JSON.stringify(dass), { headers: headers }).map(res => res.json()).subscribe(
        err => {
          this.refuse()
        }
      );
    } catch (e) {
      this.showToast(e)
    }
  }

  //find specific user
  getUser(id) {
    try {
      return this.http.get(`${this.rootUrl}/users/${id}`).map(res => res.json()).take(1)
    } catch (e) {
      this.showToast(e)
    }
  }

  //get specific class
  getClass(id) {
    try {
      return this.http.get(`${this.rootUrl}/${this.file}/${id}`).map(res => res.json()).take(1)
    } catch (e) {
      this.showToast(e)
    }
  }

  //update a specific class
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
    try {
      return this.http.put(`${this.rootUrl}/${this.file}/${id}`, body, { headers: headers }).map(res => res.json()).take(1)
    } catch (e) {
      this.showToast(e)
    }
  }

  //login function
  login(cred) {
    try {
      let headers = new Headers();
      headers.append('Content-Type', 'application/json');

      return this.http.post(`${this.rootUrl}/users/login`, JSON.stringify(cred), { headers: headers }).map(res => res.json())
    } catch (e) { Promise.reject(e) }
  }

  //function that handles population and caching login information after login
  preLogin(body) {
    try {
      this.login(body).subscribe(allowed => {
        if (allowed.success) {
          this.cred = allowed;
          allowed.userInfo.password = body.password
          this.publish(allowed.userInfo);
          this.storage.set('cred', allowed);
        } else {
          this.showToast(allowed.msg);
        }
      },err => {
        this.refuse()
      })
    } catch (e) {
      this.showToast(e);
    }
  }

  //register function
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

    this.postRegister(body).subscribe(allowed => {
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

  //function that posts the login function to the backend
  postRegister(body) {
    let headers = new Headers();
    headers.append('Content-Type', 'application/json');
    try {
      return this.http.post(`${this.rootUrl}/users/signup`, JSON.stringify(body), { headers: headers }).map(res => res.json())
    } catch (e) {
      this.showToast(e)
    }
  }

  public logout() {
    return Observable.create(observer => {
      this.currentUser = null;
      observer.next(true);
      observer.complete();
    });
  }

  //This function catches and displays app erros as a toast message at the bottom of the screen
  showToast(message: string, timeout: number = 8000, position: string = 'buttom') {
    this.toastCtrl.create({
      message: message,
      duration: timeout,
      position: 'bottom'
    }).present();
  }

  //The function that 
  publish(user) {
    this.event.publish('user : logged in', user)
  }

  //update a specific user
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

    try {
      return this.http.put(`${this.rootUrl}/users/${body._id}`, JSON.stringify(body), { headers: headers }).map(res => res.json())
    } catch (e) {
      this.showToast(e)
    }
  }

  //stores user credentials to the backend
  getStuff() {
    try {
      return this.storage.get('cred')
    } catch (e) {
      this.showToast(e)
    }
  }

  //removes a class from the backend
  delete(body) {
    try {
      return this.http.delete(`${this.rootUrl}/${this.file}/${body._id}`, JSON.stringify(body)).map(res => res.json())
    } catch (e) {
      this.showToast(e)
    }
  }
  
  //translates strings in the app based on the parameters sent and the language files in assets
  translateFunc(param: string) {
    try {
      var yeild
      this.translate.get(param).subscribe((res: string) => {
        console.log(res);
        yeild = res
      });
      return yeild
    } catch (e) {
      this.showToast(e)
    }
  }

  //used to translate dynamic content
  async yandex(param, lang) {
    try {
      let value = await translation(param, { from: lang, to: this.lang, engine: 'yandex', key: 'trnsl.1.1.20181114T194518Z.640236167701ee19.296338b36aa783c4b9a4aee7b5155955c41493ca' }
      ).then(text => {
        console.log(text)
        return text
      });
      return value
    } catch (e) {
      this.showToast(e)
    }
  }

  //fix this
  async bandies(param, lang) {
    try {
    let value = await translation(param, { from: this.lang, to: lang, engine: 'yandex', key: 'trnsl.1.1.20181114T194518Z.640236167701ee19.296338b36aa783c4b9a4aee7b5155955c41493ca' }
    ).then(text => {
      console.log(text)
      return text
    });
    return value
  } catch (e){
    this.showToast(e)
  }
  }

  refuse(){
    let toast = this.toastCtrl.create({
      message: 'Connection to the API was unsuccessful. Check your internet connection.',
      // duration: 3000,
      position: 'bottom',
      showCloseButton : true,
      closeButtonText : 'OK'
    });
    toast.present();

  }
}
