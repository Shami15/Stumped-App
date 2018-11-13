import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, ViewController } from 'ionic-angular';
import { DataServiceProvider } from "../../providers/data-service/data-service";
import _ from 'lodash';
// import { UserPage } from '../user/user';
import { ItemDetailsPage } from '../item-details/item-details';
import { ListPage } from '../list/list';


/**
 * Generated class for the ClassIPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-class-i',
  templateUrl: 'class-i.html',
})
export class ClassIPage {
  private info: any;
  private user: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, private ds: DataServiceProvider, private alertCtrl: AlertController,
    public viewCtrl: ViewController) {
    this.info = this.navParams.data;
    delete this.info.component;
    delete this.info.opts;
    this.user = this.ds.cred.userInfo.userName;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ClassIPage');
  }

  leaveClass() {
    let sure = this.ds.translateFunc('info.sure')
    let yes = this.ds.translateFunc('yes')
    let no = this.ds.translateFunc('no')
    let alert = this.alertCtrl.create({
      title: sure,
      message: null,
      buttons: [
        {
          text: no,
          role: 'cancel',
          handler: () => {
            console.log('Cancel')
          }
        },
        {
          text: yes,
          handler: () => {

            _.pull(this.info.students, this.user);
            this.ds.joinClass(this.info._id, this.info).subscribe();
            //NB Fix this b4 u done This has to pop to root when the student is deleted but it giving the removeview error
            this.viewCtrl.dismiss(this.info)
            // this.navCtrl.popToRoot();
          }
        }
      ]
    });
    alert.present();
  }

  addStudents() {
    this.navCtrl.push(ItemDetailsPage, this.info)
  }

  editClass(){
    this.navCtrl.push(ListPage, this.info)
  }

  delete(){
    let secret = 'COLGATE'
    this.ds.delete(this.info).subscribe()
    this.viewCtrl.dismiss(secret)
  }
}
