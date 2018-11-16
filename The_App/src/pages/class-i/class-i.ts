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
  private info: any;//Class info
  private user: any;//logged in user username
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

  // removing the user from the students array and popping them from the class
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
            try {
              _.pull(this.info.students, this.user);
              this.ds.joinClass(this.info._id, this.info).subscribe();
              this.viewCtrl.dismiss(this.info)
            } catch (e) {
              this.ds.showToast(e)
            }
          }
        }
      ]
    });
    alert.present();
  }

  //pushes page that adds students
  addStudents() {
    this.navCtrl.push(ItemDetailsPage, this.info)
  }

  //pushes page that edits class info
  editClass() {
    this.navCtrl.push(ListPage, this.info)
  }

  // deletes the class from the database
  delete() {
    try {
    let secret = 'COLGATE'
    this.ds.delete(this.info).subscribe()
    this.viewCtrl.dismiss(secret)
    } catch (e) {
      this.ds.showToast(e)
    }
  }
}
