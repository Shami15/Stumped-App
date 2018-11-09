import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, Events } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { Storage } from '@ionic/storage';

import { DataServiceProvider } from "../../providers/data-service/data-service";


/**
 * Generated class for the UserPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-user',
  templateUrl: 'user.html',
})
export class UserPage {

  private user : any;
  private form : any

  constructor(public navCtrl: NavController, public navParams: NavParams, public ds : DataServiceProvider, private formBuilder: FormBuilder,
    private alertCtrl: AlertController, private event : Events,  public storage: Storage) {
    this.user = this.navParams.data;
    // this.students = this.Class.students
    this.form = this.formBuilder.group({
      userName: [this.user.userName],
      email: [this.user.email],
      fName: [this.user.fName],
      lName: [this.user.lName],

    });
  }
  

  ionViewDidLoad() {
    console.log('ionViewDidLoad UserPage');
  }

  save(user){
    try{
    this.ds.updateUser(user).subscribe(res =>
      this.ds.cred.userInfo = res
      );
    this.event.publish('user : logged in', user);
    this.storage.set('cred', this.ds.cred);
    this.presentAlert();
    this.navCtrl.pop()
    } catch (e) {

    }

  }

  presentAlert() {
    let alert = this.alertCtrl.create({
      title: 'User Updated',
      // subTitle: '10% of battery remaining',
      buttons: ['Ok']
    });
    alert.present();
  }

}
