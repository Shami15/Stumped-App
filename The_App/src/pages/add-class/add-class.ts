import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { DataServiceProvider } from "../../providers/data-service/data-service";
import { Observable } from 'rxjs/Observable';
import { userModel } from '../../app/models/users'
import _ from 'lodash';
import { ClassPage } from '../class/class';
import { Body } from '@angular/http/src/body';


/**
 * Generated class for the AddClassPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-add-class',
  templateUrl: 'add-class.html',
})
export class AddClassPage {
  private class: any;
  private students = [];
  private join: any;
  private user : any;
  private searchVal: any;
  private classVal : any;
  private state : string = "u";
  private expand : Boolean = false;

  constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder,
    private ds: DataServiceProvider,  private alertCtrl: AlertController) {

    this.class = this.formBuilder.group({
      name: ['', Validators.required],
      subject: ['', Validators.required],
      description: ['', Validators.required],
      students: [''],

    });

    this.ds.getUser("000").subscribe(data => {this.user = data});
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddClassPage');
  }

  submitClass(dass) {
    try {
      // console.log(JSON.stringify(dass))
      let body = {
        name: dass.value.name,
        subject: dass.value.subject,
        students: this.students,
        teacher: this.ds.cred.userInfo.userName,
        description : dass.value.description,
        questions: [],
      };
    this.ds.createClass(body);
    let yarn = this.ds.translateFunc('add.created')

    //THE PROBLEM IS HERE BECAUSE THERE IS NO QUESTION VALUE, THE QUESTION FIELD IS CREATED IN THE BACK END SO FIX THAT.
    this.presentConfirm(body, yarn);

  } catch (e){ console.log(e)}
    // console.log('function ran')
   }
   
   onInput(ev : any){
     let val = ev.target.value;
     this.ds.getUser(val).subscribe((data : any) => { console.log(data); this.searchVal = data}
    ,err =>{this.searchVal = err}
    );
     console.log(this.searchVal)
   }

   searchClass(ev : any){
    let val = ev.target.value;
    this.ds.getClass(val).subscribe((data : any) => { console.log(data); this.classVal = data}
   ,err =>{this.searchVal = err}
   );
    console.log(this.searchVal)
   }

   addUser(){
     let test = _.some(this.students , _.method('includes', this.searchVal.userName))
     test == false ? this.students.push(this.searchVal.userName) : this.presentAlert()
     this.searchVal = null;
   }

  joinClass() { 
    
    console.log(this.classVal);
    try{
      this.classVal.students.push(this.ds.cred.userInfo);
      this.ds.joinClass(this.classVal._id, this.classVal).subscribe();

      let yarn = this.ds.translateFunc('add.joined')
      this.presentConfirm(this.classVal, yarn);
    } catch(err) { console.log(err)}


  };


  presentConfirm(dass, type) {
    let succ = this.ds.translateFunc('add.succ')
    let mess = this.ds.translateFunc('add.mess')
    let yes = this.ds.translateFunc('yes')
    let no = this.ds.translateFunc('no')

    let alert = this.alertCtrl.create({
      title: type + succ,
      message: mess,
      buttons: [
        {
          text: yes,
          role: 'cancel',
          handler: () => {
            this.navCtrl.push(ClassPage, dass)
          }
        },
        {
          text: no,
          handler: () => {
          }
        }
      ]
    });
    alert.present();
  }

  collapsible(){
    this.expand == false ? this.expand = true : this.expand = false
  }

  presentAlert() {
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
