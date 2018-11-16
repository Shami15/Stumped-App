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

  // make LoginPage the root (or first) page
  rootPage = LoginPage;
  // public user = this.ds.cred
  public user: any;//Value that holds the user to display on the side menu
  public lang = 'en';//language

  constructor(
    public platform: Platform,
    public menu: MenuController,
    public statusBar: StatusBar,
    public splashScreen: SplashScreen,
    public ds: DataServiceProvider,
    public event: Events,
    public storage: Storage,
    private translate: TranslateService,
  ) {
    this.initializeApp();
    this.initTranslate();
    //event that runs in a successful login
    event.subscribe('user : logged in', (user) => {
      this.user = user //user is populated to side bar  
      this.nav.setRoot(HelloIonicPage)//navigates to home page
    });
  }

  initializeApp() {
    this.platform.ready().then(() => {
      //if there is no cashed user then the login page runs
      this.ds.getStuff().then(data => {
        if (data == null) {
          this.nav.setRoot(LoginPage)
        } else {
          //if there is a cached user then this logs that user in
          let body = {
            userName: data.userInfo.userName,
            password: data.userInfo.password
          }
          this.ds.preLogin(body)
        }
      }
      ), error =>{
        console.log(error)
      }
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  logout() {
    //removes user from cache
    this.storage.remove('cred');
    //send user back to the login
    this.nav.setRoot(LoginPage)
  }

  //function to edit user info (vaulted for now due to password erros)
  // edit() {
  //   this.menu.close();
  //   this.nav.push(UserPage, this.user)
  // }

  initTranslate() {
    try {
      // Set the default language for translation strings, and the current language.
      this.translate.setDefaultLang('en');
      this.ds.lang = 'en';
      if (this.translate.getBrowserLang() !== undefined) {
        this.translate.use(this.translate.getBrowserLang());
      } else {
        this.translate.use('en'); // Set your language here
      }
    }
    catch (e) { this.ds.showToast(e) }
  }

  public changeLanguage(language) {
    try{
    this.translate.use(language);
    //stores the current language the app is set to in the data service
    this.ds.lang = language
    } catch (e) { this.ds.showToast(e) }
  }


}
