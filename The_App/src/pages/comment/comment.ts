import { Component } from '@angular/core';
import { NavController, NavParams, ModalController } from 'ionic-angular';
import {Validators, FormBuilder, FormGroup } from '@angular/forms';
import { DataServiceProvider } from "../../providers/data-service/data-service";
import _ from 'lodash';

/**
 * Generated class for the CommentPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-comment',
  templateUrl: 'comment.html',
})
export class CommentPage {

  private post : any;
  private Class : any;
  private question : any;
  // private match : any

  constructor(public navCtrl: NavController, public navParams: NavParams, public mode : ModalController, public formB : FormBuilder,
    private ds: DataServiceProvider) {
    this.Class = this.navParams.data;
    this.question = this.ds.frizbe;

    this.post = this.formB.group({
      topic: [''],
      description: ['', Validators.required],
    });
    this.question = this.ds.frizbe;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CommentPage');
  }

  goBack(){
    this.navCtrl.pop()
  }

  posting(post){
    if(this.question == undefined){
    let addition = {
      id : '01',
      thumbnail : '',
      topic : post.value.topic,
      description : post.value.description,
      user : this.ds.cred.userInfo.userName,
      answered : false,
      comment : [],
      votes : []
    }
    this.Class.questions.push(addition);}
    else{
      let addition = {
        user : this.ds.cred.userInfo.userName,
        id : '01',
        text : post.value.description,
        img :'',
        video : '',
        file : '',
        votes : []
      }
      let index = _.indexOf(this.Class.questions, _.find(this.Class.questions, this.question));
      this.Class.questions[index].comment.push(addition);
      console.log(this.Class)
    }

    this.ds.joinClass(this.Class._id , this.Class).subscribe();
    this.navCtrl.pop();
  }


}
