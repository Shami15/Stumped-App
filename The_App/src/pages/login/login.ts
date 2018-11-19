import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, Loading, ToastController, Events } from 'ionic-angular';
import { DataServiceProvider } from "../../providers/data-service/data-service";
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { HelloIonicPage } from '../hello-ionic/hello-ionic';
import { TranslateService } from "@ngx-translate/core";
import { IonicStorageModule } from '@ionic/storage';

/**
 * Generated class for the LoginPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-login',
  templateUrl: 'login.html',
})
export class LoginPage {

  // registerCredentials = { email: '', password: '' };
  loading: Loading;
  // private credentials = this.ds.cred
  private user: any;
  private nUser: any;
  private page: boolean = false;//this boolean is for switching the forms

  constructor(public navCtrl: NavController, public navParams: NavParams, public ds: DataServiceProvider,
    private loadingCtrl: LoadingController, private toastCtrl: ToastController, private formBuilder: FormBuilder, private event: Events,
    private translate: TranslateService) {

    // The login form
    this.user = this.formBuilder.group({
      userName: ['', Validators.required],
      password: ['', Validators.required]
    });

    // signup form
    this.nUser = this.formBuilder.group({
      userName: ['', Validators.required],
      password: ['', Validators.required],
      fName: [''],
      lName: [''],
      passwordC: ['', Validators.required],
      email: ['', Validators.required],
    });

    translate.setDefaultLang('en');

    // the lang to use, if the lang isn't available, it will use the current loader to get them
    translate.use('en');
  }



  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }

  login(user) {
    try {
      this.showLoading()
      let body = {
        userName: user.value.userName,
        password: user.value.password
      };
      this.ds.preLogin(body)
    } catch (e) {
      this.ds.showToast(e)
    }
  }

  public signup(user) {
    try {
      let match = this.ds.translateFunc('match')
      //dis needs to change plzzzzz
      if (user.password !== user.passwordC) {
        this.ds.showToast(match)
      } else {
        this.showLoading()
        this.ds.register(user)
      }
    } catch (e) {
      this.ds.showToast(e)
    }
  }

  showLoading() {
    this.loading = this.loadingCtrl.create({
      content: 'Please wait...',
      dismissOnPageChange: true
    });
    this.loading.present();
    setTimeout(() => {
      this.loading.dismiss();
    }, 2500);
  }

  //function that switches the forms
  switch() {
    this.page ? this.page = false : this.page = true
  }

  //this function publishes the login event when login is successful
  publish(user) {
    try {
      this.event.publish('user : logged in', user)
    } catch (e) {
      this.ds.showToast(e)
    }
  }
}
