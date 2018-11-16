import { Component } from '@angular/core';
import { NavController, LoadingController, Events, PopoverController } from 'ionic-angular';
import { AddClassPage} from '../add-class/add-class';
import { Observable } from 'rxjs/Observable';
import { DataServiceProvider } from "../../providers/data-service/data-service"
import { dataModel } from '../../app/models/data'
import { ClassPage } from '../class/class';
import {TranslateService} from "@ngx-translate/core";
import _ from 'lodash';

@Component({
  selector: 'page-hello-ionic',
  templateUrl: 'hello-ionic.html'
})
export class HelloIonicPage {

  data : Observable<Array<dataModel>>;
  private state : string = "u"; //string that is used to switch the sections of the app
  public user : any;
  constructor(public navCtrl: NavController, private popoverCtrl: PopoverController, private ds: DataServiceProvider, 
    private translate: TranslateService) {
    this.getData();//gets all the classes
    this.user = this.ds.cred.userInfo;//sets the logged in user as a local variable

    // translate.setDefaultLang('en');
    // the lang to use, if the lang isn't available, it will use the current loader to get them
  //  translate.use('en');
  }

  addClass(){
    try {
    //Navigates to the page that let users create and join classes
    this.navCtrl.push(AddClassPage)
    }catch (e) { this.ds.showToast(e) }
  }

  getData(){
    try {
    //retrieves classes from the database
    this.data = this.ds.getData();
    // this.pear = _.filter(this.data, {'teacher' : this.user.teacher})
    } catch (e) { this.ds.showToast(e) }
  }

  goToClass(Class){
    try {
    //Navigates to the class the user selected
    this.navCtrl.push(ClassPage, Class)
    } catch (e) { this.ds.showToast(e) }
  }
}
