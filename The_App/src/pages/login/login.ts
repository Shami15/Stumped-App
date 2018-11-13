import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, Loading, ToastController, Events } from 'ionic-angular';
import { DataServiceProvider } from "../../providers/data-service/data-service";
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { HelloIonicPage } from '../hello-ionic/hello-ionic';
import {TranslateService} from "@ngx-translate/core";
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

  registerCredentials = { email: '', password: '' };
  loading: Loading;
  // private credentials = this.ds.cred
  private user : any;
  private nUser : any;
  private page : boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public ds: DataServiceProvider, 
    private loadingCtrl: LoadingController, private toastCtrl : ToastController, private formBuilder : FormBuilder, private event : Events,
    private translate: TranslateService) {

      this.user = this.formBuilder.group({
        userName: ['', Validators.required],
        password: ['', Validators.required]
      });

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

  // public login(user) {
  //   this.showLoading()
  //   this.ds.login(user).subscribe(allowed => {
  //     if (allowed) {        
  //       // this.navCtrl.setRoot('HomePage');
  //       console.log(JSON.stringify(allowed));
  //       this.ds.cred = allowed;
  //       this.publish(allowed.userInfo)
  //       this.navCtrl.setRoot(HelloIonicPage)
  //     } else {
  //       this.showError("Access Denied");
  //     }
  //   },
  //     error => {
  //       this.showError(error);
  //     });
  // }

   login(user){
    try{
    this.showLoading()
    let body = {
      userName: user.value.userName,
      password: user.value.password
    };
    this.ds.test(body)
   } catch (e) {
     this.ds.showToast(e)
   }

  }

  public signup(user) {
    let match = this.ds.translateFunc('match')
    //dis needs to change plzzzzz
    if(user.password !== user.passwordC){
      this.ds.showToast(match)
    }else{
    this.showLoading()
    this.ds.register(user)
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
 
  showError(text) {
    this.loading.dismiss();
 
    // let alert = this.alertCtrl.create({
    //   title: '',
    //   subTitle: text,
    //   buttons: ['OK']
    // });
    // alert.present(prompt);

    let toast = this.toastCtrl.create({
      message: text,
      duration: 3000,
      position: 'top'
    });
    toast.present();

  }

  switch(){
    this.page ? this.page = false : this.page = true
  }

  publish(user){
    this.event.publish('user : logged in', user)
  }

  // delete(){
  //   this.navCtrl.pop()
  // }


}
