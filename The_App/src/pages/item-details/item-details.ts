import { Component } from '@angular/core';

import { NavController, NavParams, AlertController } from 'ionic-angular';

import { DataServiceProvider } from "../../providers/data-service/data-service";

import _ from 'lodash';




@Component({
  selector: 'page-item-details',
  templateUrl: 'item-details.html'
})
export class ItemDetailsPage {
  private searchVal: any; //The value that returns from the search function
  private Class: any;//Class information
  private students: any; //students array
  private expand: Boolean = false; //boolean for expandable list

  constructor(public navCtrl: NavController, public navParams: NavParams, public ds: DataServiceProvider, private alertCtrl: AlertController) {
    // If we navigated to this page, we will have an item available as a nav param
    this.Class = this.navParams.data; this.students = this.Class.students

  }

  // function that runs when the user searches for a user
  onInput(ev: any) {
    try {
      let val = ev.target.value;
      this.ds.getUser(val).subscribe((data: any) => { console.log(data); this.searchVal = data }
        , err => { this.searchVal = err }
      );
    } catch (e) {
      this.ds.showToast(e)
    }
  }

  // adding a user to the students array
  addUser() {
    try {
      let test = _.some(this.students, _.method('includes', this.searchVal.userName))
      test == false ? this.students.push(this.searchVal.userName) : this.duplicate()
      this.searchVal = null;
    } catch (e) {
      this.ds.showToast(e)
    }
  }

  // submitting the new students array to the backend
  submitUsers() {
    try {
      this.Class.students = this.students;
      this.ds.joinClass(this.Class._id, this.Class).subscribe();
      this.navCtrl.pop()
    } catch (e) { this.ds.showToast(e) }
  }

  //for the collapable array on the create class form
  collapsible() {
    this.expand == false ? this.expand = true : this.expand = false
  }

  //prevents the user from entering duplicate users
  duplicate() {
    let dup = this.ds.translateFunc('add.dup')
    let sub = this.ds.translateFunc('add.sub')
    let ok = this.ds.translateFunc('ok')
    let alert = this.alertCtrl.create({
      title: dup,
      subTitle: sub,
      buttons: [ok]
    });
    alert.present();
  }
}
