import { Component, ViewChild } from '@angular/core';

import { Platform, MenuController, Nav, NavController, Events } from 'ionic-angular';

import { HelloIonicPage } from '../pages/hello-ionic/hello-ionic';
import { ListPage } from '../pages/list/list';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoginPage } from '../pages/login/login';
import { UserPage } from '../pages/user/user';


import { DataServiceProvider } from "../providers/data-service/data-service";
import { Storage } from '@ionic/storage';


import { TranslateService } from '@ngx-translate/core';


@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  @ViewChild(Nav) nav: Nav;

  // make HelloIonicPage the root (or first) page
  rootPage = LoginPage;
  pages: Array<{ title: string, component: any }>;
  // public user = this.ds.cred
  public user: any;
  public test = 'test string';
  // public lang = ['en','sp','fr','ch']
  public lang = 'en';

  constructor(
    public platform: Platform,
    public menu: MenuController,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public ds: DataServiceProvider,
    public event: Events,
    public storage: Storage,
    private translate: TranslateService,
  
    // public navCtrl: NavController
  ) {
    
    this.initializeApp();
    this.initTranslate(); 
    event.subscribe('user : logged in', (user) => {
      this.user = user
      this.nav.setRoot(HelloIonicPage)
      console.log(JSON.stringify(user));
    });


    // set our app's pages
    // this.pages = [
    //   { title: 'Hello Ionic', component: HelloIonicPage },
    //   { title: 'My First List', component: ListPage }
    // ];
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.ds.getStuff().then(data => {
        if (data == null) {
          this.nav.setRoot(LoginPage)
        } else {
          let body = {
            userName: data.userInfo.userName,
            password: data.userInfo.password
          }
          this.ds.test(body)
        }
        console.log(data)
      }
      )
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });



  }

  openPage(page) {
    // close the menu when clicking a link from the menu
    this.menu.close();
    // navigate to the new page if it is not the current page
    this.nav.setRoot(page.component);
  }

  logout() {
    this.nav.setRoot(LoginPage)
  }

  edit() {
    this.menu.close();
    this.nav.push(UserPage, this.user)
  }

  // storageCheck(){
  //   let cred 
  //   this.storage.get('cred').subscribe( cred =>)
  //   if(cred == null || undefined){
  //     this.nav.setRoot(LoginPage)
  //   }else {
  //     this.nav.setRoot(HelloIonicPage)
  //     this.ds.test(cred.userInfo)
  //   }
  // }

    initTranslate() {
      // Set the default language for translation strings, and the current language.
      this.translate.setDefaultLang('en');
      this.ds.lang = 'en';
      if (this.translate.getBrowserLang() !== undefined) {
          this.translate.use(this.translate.getBrowserLang());
      } else {
          this.translate.use('en'); // Set your language here
      }

    

  }

  public changeLanguage(language)
  {
    console.log(language)
    this.translate.use(language);
    this.ds.lang = language 
  }


}
