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
  // pear : Observable<Array<dataModel>>;
  private state : string = "u";
  public user : any;
  constructor(public navCtrl: NavController, private popoverCtrl: PopoverController, private ds: DataServiceProvider, 
    private translate: TranslateService) {
    this.getData();
    this.user = this.ds.cred.userInfo;

    translate.setDefaultLang('en');

    // the lang to use, if the lang isn't available, it will use the current loader to get them
   translate.use('en');

  }

  addClass(){
    this.navCtrl.push(AddClassPage)
  }

  // showUser(myEvent) {
  //   let popover = this.popoverCtrl.create(UserPage);
  //   popover.present({
  //     ev: myEvent
  //   });
  // }

  getData(){
    this.data = this.ds.getData();
    // this.pear = _.filter(this.data, {'teacher' : this.user.teacher})
  }

  goToClass(Class){
    this.navCtrl.push(ClassPage, Class)
  }
  
  // public changeLanguage(language)
  // {
  //   this.translate.use(language);
  // }


  
}
