import { Component } from '@angular/core';
import { NavController, NavParams, AlertController } from 'ionic-angular';
import { DataServiceProvider } from "../../providers/data-service/data-service";
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import _ from 'lodash';

/**
 * Generated class for the QuestionPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@Component({
  selector: 'page-question',
  templateUrl: 'question.html',
})
export class QuestionPage {
  public Class: any;
  public question: any;
  public comments: any;
  private post: any;
  private user: any;
  private like: Boolean;

  constructor(public navCtrl: NavController, public navParams: NavParams, public ds: DataServiceProvider, public formB: FormBuilder,
    private alertCtrl: AlertController) {
    this.Class = this.ds.saucer; this.question = this.navParams.data; this.comments = this.question.comment;
    this.user = this.ds.cred.userInfo.userName;

    this.post = this.formB.group({
      description: ['', Validators.required],
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad QuestionPage');
    this.like = _.includes(this.question.votes, this.user)
  }

  postCom(post) {
    let addition = {
      user: this.ds.cred.userInfo.userName,
      id: '01',
      text: post.value.description,
      img: '',
      video: '',
      file: '',
      votes: []
    }
    this.question.comment.push(addition);
    let index = _.indexOf(this.Class.questions, _.find(this.Class.questions, this.question));
    this.Class.questions[index] = this.question;

    this.ds.joinClass(this.Class._id, this.Class).subscribe();
  }

  answered() {
    let alert = this.alertCtrl.create({
      title: 'Are you sure?',
      message: 'By choosing yes, you are indicating that your question has been answered',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.question.answered = true;
            let index = _.indexOf(this.Class.questions, _.find(this.Class.questions, this.question));
            this.Class.questions[index] = this.question;
            this.ds.joinClass(this.Class._id, this.Class).subscribe();
          }
        }
      ]
    });
    alert.present();
  }

  unclear() {
    let alert = this.alertCtrl.create({
      title: 'Are you sure?',
      message: 'By choosing yes, you are indicating that your question is stil unclear and are reposting it to the unanswered section',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            this.question.answered = false;
            let index = _.indexOf(this.Class.questions, _.find(this.Class.questions, this.question));
            this.Class.questions[index] = this.question;
            this.ds.joinClass(this.Class._id, this.Class).subscribe();
          }
        }
      ]
    });
    alert.present();
  }

  upVote() {
    if (this.like == false) {
      this.question.votes.push(this.user)
      //make this a function
      let index = _.indexOf(this.Class.questions, _.find(this.Class.questions, this.question));
      this.Class.questions[index] = this.question;
      this.ds.joinClass(this.Class._id, this.Class).subscribe();
      this.like = true
    } else {
      this.question.votes = _.pull(this.question.votes, this.user);
      this.like = false
    }
  }

  

  delete(ques, comm) {
    let alert = this.alertCtrl.create({
      title: 'Remove ' + ques + '?',
      message: 'Are you sure you want to remove this ' + ques + '?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          handler: () => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Yes',
          handler: () => {
            if (ques == 'Question') {
              _.remove(this.Class.questions, this.question)
              console.log(this.Class.questions)
              this.ds.joinClass(this.Class._id, this.Class).subscribe();
              this.navCtrl.pop()
            } else {
              _.remove(this.question.comment, comm)
              console.log(this.question.comment)
              let index = _.indexOf(this.Class.questions, _.find(this.Class.questions, this.question));
              this.Class.questions[index] = this.question;
              this.ds.joinClass(this.Class._id, this.Class).subscribe();
            }
          }
        }
      ]
    });
    alert.present();

  }
}
