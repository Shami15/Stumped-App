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
  private class: any; //the class form
  private students = []; //array of students in the new class
  // private join: any;
  private user: any;
  private searchVal: any;//the user found when searching for users
  private classVal: any;//the user found when searching for classes
  private state: string = "u"; //value used to switch between forms
  private expand: Boolean = false; // boolean used to expand students list
  private lang = 'en';//value used in language select

  constructor(public navCtrl: NavController, public navParams: NavParams, private formBuilder: FormBuilder,
    private ds: DataServiceProvider, private alertCtrl: AlertController) {

    //new class form
    this.class = this.formBuilder.group({
      name: ['', Validators.required],
      subject: ['', Validators.required],
      description: ['', Validators.required],
      students: [''],
      lang: ['en', Validators.required]
    });

    this.ds.getUser("000").subscribe(data => { this.user = data });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddClassPage');
  }

  submitClass(dass) {
    //function that creates a new class
    try {
      // console.log(JSON.stringify(dass))
      let body = {
        name: dass.value.name,
        subject: dass.value.subject,
        students: this.students,
        teacher: this.ds.cred.userInfo.userName,
        description: dass.value.description,
        questions: [],
        lang: dass.value.lang
      };
      this.ds.createClass(body);
      let yarn = this.ds.translateFunc('add.created')
      this.succ(body, yarn);

    } catch (e) { console.log(e) }
  }

  onInput(ev: any) {
    try {
      //used to search for users
      let val = ev.target.value;
      this.ds.getUser(val).subscribe((data: any) => { console.log(data); this.searchVal = data }
        , err => { this.searchVal = err }
      );
    } catch (e) {
      this.ds.showToast(e)
    }
  }

  searchClass(ev: any) {
    try {
      //used to search for classes
      let val = ev.target.value;
      this.ds.getClass(val).subscribe((data: any) => { console.log(data); this.classVal = data }
        , err => { this.searchVal = err }
      );
    } catch (e) {
      this.ds.showToast(e)
    }
  }

  addUser() {
    try {
      //appends a unique student to the student array for a new class
      let test = _.some(this.students, _.method('includes', this.searchVal.userName))
      test == false ? this.students.push(this.searchVal.userName) : this.duplicate()
      this.searchVal = null;
    } catch (e) {
      this.ds.showToast(e)
    }
  }

  joinClass() {
    //adds the user to the class array
    try {
      this.classVal.students.push(this.ds.cred.userInfo);
      this.ds.joinClass(this.classVal._id, this.classVal).subscribe();
      let yarn = this.ds.translateFunc('add.joined')
      this.succ(this.classVal, yarn);
    } catch (err) { console.log(err) }
  };


  succ(dass, type) {
    // this alert run if a user joins or creates a class succussfully
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

  collapsible() {
    //for the collapable array on the create class form
    this.expand == false ? this.expand = true : this.expand = false
  }

  duplicate() {
    //alerts the user the user already exsists in the students array
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
