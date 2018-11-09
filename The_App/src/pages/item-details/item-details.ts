import { Component } from '@angular/core';

import { NavController, NavParams, AlertController } from 'ionic-angular';

import { DataServiceProvider } from "../../providers/data-service/data-service";

import _ from 'lodash';




@Component({
  selector: 'page-item-details',
  templateUrl: 'item-details.html'
})
export class ItemDetailsPage {
  private searchVal : any;
  private Class : any;
  private students : any;
  private expand : Boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, public ds : DataServiceProvider, private alertCtrl : AlertController) {
    // If we navigated to this page, we will have an item available as a nav param
    this.Class = this.navParams.data; this.students = this.Class.students
  
  }

    onInput(ev : any){
    let val = ev.target.value;
    this.ds.getUser(val).subscribe((data : any) => { console.log(data); this.searchVal = data}
   ,err =>{this.searchVal = err}
   );
    console.log(this.searchVal)
  }

  addUser(){
    let test = _.some(this.students , _.method('includes', this.searchVal.userName))
     test == false ? this.students.push(this.searchVal.userName) : this.presentAlert()
     this.searchVal = null;
  }

  submitUsers(){
    this.Class.students = this.students;

    this.ds.joinClass(this.Class._id, this.Class).subscribe();
    this.navCtrl.pop()
  }

  collapsible(){
    this.expand == false ? this.expand = true : this.expand = false
  }

  presentAlert() {
    let alert = this.alertCtrl.create({
      title: 'Duplicate user',
      subTitle: 'This user is already registered in this class',
      buttons: ['OK']
    });
    alert.present();
  }
}
