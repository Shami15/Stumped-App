import { Component } from '@angular/core';
import { NavController, NavParams, PopoverController, ModalController, AlertController } from 'ionic-angular';
import { QuestionPage } from '../question/question';
import { CommentPage } from '../comment/comment';
import { ClassIPage } from '../class-i/class-i';
import { DataServiceProvider } from "../../providers/data-service/data-service";
import _ from 'lodash';
// import { THIS_EXPR } from '@angular/compiler/src/output/output_ast';

/**
 * Generated class for the ClassPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-class',
  templateUrl: 'class.html',
})
export class ClassPage {
  private Class: any;
  private state: string = "u";
  private questions: any;
  private voted: string = "primary";
  private data: any;
  private user: any;
  private like: any;
  private yes = this.ds.translateFunc('yes');
  private no = this.ds.translateFunc('no');
  private babel: boolean = false;
  // public ring: any;
  public transTitle: any;


  constructor(public navCtrl: NavController, public navParams: NavParams, public popoverCtrl: PopoverController,
    public mode: ModalController, private ds: DataServiceProvider, private alertCtrl: AlertController) {
    this.Class = this.navParams.data; this.questions = this.Class.questions;
    this.user = this.ds.cred.userInfo.userName;
    let yes = this.ds.translateFunc('yes');
    let no = this.ds.translateFunc('no');

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ClassPage');
    if (this.Class.lang !== this.ds.lang) {
      console.log('DI LANGUAGE DIFFERENT');
      this.transCheck()
    }
    // this.like = _.includes(this.questions.votes, this.user)
  }

  upVote(item) {
    if (this.like == false) {
      this.questions.votes.push(this.user)
      //make this a function
      let index = _.indexOf(this.Class.questions, _.find(this.Class.questions, this.questions));
      this.Class.questions[index] = this.questions;
      this.ds.joinClass(this.Class._id, this.Class).subscribe();
      this.like = true
    } else {
      this.questions.votes = _.pull(this.questions.votes, this.user);
      this.like = false
    }
  }

  showQuestion(question) {
    this.ds.saucer = this.Class;
    this.navCtrl.push(QuestionPage, question)
  }

  postComment(type) {
    this.ds.frizbe = type;
    let profileModal = this.mode.create(CommentPage, this.Class);
    profileModal.present();
  }

  showClass(classInfo, myEvent) {
    let popover = this.popoverCtrl.create(ClassIPage, classInfo/*, {cssClass: 'contact-popover'}*/);
    popover.present({
      ev: myEvent
    });
    popover.onDidDismiss(data => {
      if (data !== null) {
        this.navCtrl.pop()
        console.log('DISMISSED')
      }
    })
  }

  delete(question) {
    let rem = this.ds.translateFunc('class.remove');
    let mess = this.ds.translateFunc('class.sure');
    let yes = this.ds.translateFunc('yes');
    let no = this.ds.translateFunc('no');
    let alert = this.alertCtrl.create({
      title: rem,
      message: mess,
      buttons: [
        {
          text: no,
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: yes,
          handler: () => {
            _.remove(this.questions, question)
            console.log(this.questions)
            this.Class.questions = this.questions
            this.ds.joinClass(this.Class._id, this.Class).subscribe();
          }
        }
      ]
    });
    alert.present();
  }

  transCheck() {
    let trans = this.ds.translateFunc('class.trans');
    let alert = this.alertCtrl.create({
      title: trans,
      message: null,
      buttons: [
        {
          text: this.no,
          role: 'cancel',
          handler: () => {

          }
        },
        {
          text: this.yes,
          handler: () => {
            this.towerOfBabel()
          }
        }
      ]
    });
    alert.present();
  }


  towerOfBabel() {
    this.babel = true; 
    this.ds.yandex(this.Class.name, this.Class.lang).then(val => {
      this.transTitle = val
    })
    _.forEach(this.questions, value => {
    this.ds.yandex(value.topic, this.Class.lang).then(val => {
        value.topic = val
      });
    this.ds.yandex(value.description, this.Class.lang).then(val => {
        value.description = val
      });
    })
  }

  

}
