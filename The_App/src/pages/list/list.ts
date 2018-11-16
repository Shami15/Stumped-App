import { Component } from '@angular/core';

import { NavController, NavParams } from 'ionic-angular';

import { ItemDetailsPage } from '../item-details/item-details';

import { Validators, FormBuilder, FormGroup } from '@angular/forms';

import { DataServiceProvider } from "../../providers/data-service/data-service";



@Component({
  selector: 'page-list',
  templateUrl: 'list.html'
})
export class ListPage {

  private Class: any//holds class information;
  private edit: any;//the class form
  // private form : any; the password form
  // private password : any; holds password information

  constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder, public ds: DataServiceProvider) {
    this.Class = this.navParams.data;

    //Form that deals with class information 
    this.edit = this.formBuilder.group({
      name: [this.Class.name],
      subject: [this.Class.subject],
      description: [this.Class.description]
    })

    // form for changing password (vaulted)
    // this.form = this.formBuilder.group({
    //   current: [''],
    //   new: [''],
    //   confirm: [''],
    // });
  }

  //posts the updated class information
  editClass(form) {
    try{
    this.Class.name = form.value.name,
      this.Class.subject = form.value.subject,
      this.Class.description = form.value.description

    this.ds.joinClass(this.Class._id, this.Class).subscribe()
    this.navCtrl.pop()
    } catch(e){
      this.ds.showToast(e)
    }

  }

  // update(pass){
  //   if(pass.value.new == pass.value.confirm){
  //     if(this.password == pass.value.current){
  //       this.navCtrl.pop()
  //     }
  //   }
  // }

}
