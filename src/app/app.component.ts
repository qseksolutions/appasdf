import { Component, ViewChild } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { TranslateService } from '@ngx-translate/core';
import { Config, Nav, Platform, MenuController, Events } from 'ionic-angular';
import { NetworkProvider } from '../providers/network/network';

import { FirstRunPage } from '../pages';
import { Settings, User } from '../providers';
import { GLOBAL } from './global';

@Component({
  templateUrl: 'app.html',
})
export class MyApp {
  rootPage = FirstRunPage;

  @ViewChild(Nav) nav: Nav;

  pages: any[] = [];
  _user: any[] = [];

  constructor(
    public events: Events,
    public user: User,
    private translate: TranslateService,
    private networkprovider: NetworkProvider,
    platform: Platform,
    settings: Settings,
    private config: Config,
    private statusBar: StatusBar,
    private splashScreen: SplashScreen,
    private menuCtrl: MenuController
  ) {
    if (GLOBAL.IS_LOGGEDIN) {
      console.log('IF');
      this.rootPage = 'HomePage';
    }
    console.log(GLOBAL.IS_LOGGEDIN);
    console.log(GLOBAL.USER);
    this._user = GLOBAL.USER;
    this.events.subscribe('user:loggedin', (user) => {
      GLOBAL.IS_LOGGEDIN = true;
      GLOBAL.USER = user;
      this._user = user;
    });
    console.log(this._user)
    this.user.category().subscribe((resp: any) => {
      if (resp.status) {
        this.pages = resp.data;
      }
    }, (err) => {
    });

    platform.ready().then(() => {
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      try {
        this.networkprovider.initializeNetworkEvents();
      } catch (error) {
        console.log(error);
      }
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
    this.initTranslate();
  }

  initTranslate() {
    // Set the default language for translation strings, and the current language.
    this.translate.setDefaultLang('en');
    const browserLang = this.translate.getBrowserLang();

    if (browserLang) {
      if (browserLang === 'zh') {
        const browserCultureLang = this.translate.getBrowserCultureLang();

        if (browserCultureLang.match(/-CN|CHS|Hans/i)) {
          this.translate.use('zh-cmn-Hans');
        } else if (browserCultureLang.match(/-TW|CHT|Hant/i)) {
          this.translate.use('zh-cmn-Hant');
        }
      } else {
        this.translate.use(this.translate.getBrowserLang());
      }
    } else {
      this.translate.use('en'); // Set your language here
    }

    this.translate.get(['BACK_BUTTON_TEXT']).subscribe(values => {
      this.config.set('ios', 'backButtonText', values.BACK_BUTTON_TEXT);
    });
  }

  openPage(page) {
    // Reset the content nav to have just this page
    // we wouldn't want the back button to show in this scenario
    this.nav.setRoot('CaregoryPage', { category:page});
  }
  openHome() {
    this.nav.setRoot('HomePage');
  }
  openProfile() {
    this.nav.push('ProfilePage');
  }
  login() {
    this.nav.push('LoginPage');
  }

  logout() {
    GLOBAL.IS_LOGGEDIN = false;
    GLOBAL.USER = null;
    this._user = null;
    localStorage.removeItem('is_loggedin');
    this.nav.setRoot('LoginPage');
    this.menuCtrl.close();
  }
}
