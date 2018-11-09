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
  
  private Class : any;
  private edit : any;
  // private form : any;
  // private password : any;

  constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder, public ds : DataServiceProvider) {
    this.Class = this.navParams.data;

    this.edit = this.formBuilder.group({
      name : [this.Class.name],
      subject : [this.Class.subject],
      description : [this.Class.description]
    })

    // this.form = this.formBuilder.group({
    //   current: [''],
    //   new: [''],
    //   confirm: [''],
    // });
  }

  editClass(form){
  
      this.Class.name = form.value.name,
      this.Class.subject = form.value.subject,
      this.Class.description = form.value.description

  this.ds.joinClass(this.Class._id, this.Class).subscribe()
  this.navCtrl.pop()


  }

  // update(pass){
  //   if(pass.value.new == pass.value.confirm){
  //     if(this.password == pass.value.current){
  //       this.navCtrl.pop()
  //     }
  //   }
  // }

}
