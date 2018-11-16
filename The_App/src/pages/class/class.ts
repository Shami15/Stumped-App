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
  private Class: any;//The class info
  private state: string = "u"; //string for the segments
  private questions: any; //array of questions the class contains
  // private voted: string = "primary";
  // private data: any;
  private user: any;//username of logged in user
  private like: any; //like boolean to see if this user already liked the question
  //yes and no strings
  private yes = this.ds.translateFunc('yes');
  private no = this.ds.translateFunc('no');
  private babel: boolean = false; //Boolean to detect change in language
  public transTitle: any; //translated title


  constructor(public navCtrl: NavController, public navParams: NavParams, public popoverCtrl: PopoverController,
    public mode: ModalController, private ds: DataServiceProvider, private alertCtrl: AlertController) {
    this.Class = this.navParams.data; this.questions = this.Class.questions;
    this.user = this.ds.cred.userInfo.userName;
    let yes = this.ds.translateFunc('yes');
    let no = this.ds.translateFunc('no');

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ClassPage');
    //checks if the content is different from the set language
    if (this.Class.lang !== this.ds.lang) {
      this.transCheck()
    }
  }

  // voting function
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

  // navigate to selected function
  showQuestion(question) {
    this.ds.saucer = this.Class;
    this.navCtrl.push(QuestionPage, question)
  }

  // Open the comment modal
  postComment(type) {
    this.ds.frizbe = type;
    let profileModal = this.mode.create(CommentPage, this.Class);
    profileModal.present();
  }

  //Show the class information
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
            try {
              _.remove(this.questions, question)
              this.Class.questions = this.questions
              this.ds.joinClass(this.Class._id, this.Class).subscribe();
            } catch (e) { this.ds.showToast(e) }
          }
        }
      ]
    });
    alert.present();
  }

  // Ask the user if they want to translate the dynamic content
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

  //translating the dynamic content
  towerOfBabel() {
    try {
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
    } catch (e) { this.ds.showToast(e) }
  }
}
