import { Component, ViewChild } from '@angular/core';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { TranslateService } from '@ngx-translate/core';
import { Config, Nav, Platform, MenuController, Events } from 'ionic-angular';
import { NetworkProvider } from '../providers/network/network';
import { OneSignal } from '@ionic-native/onesignal';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';
import { Facebook } from '@ionic-native/facebook';


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
    private menuCtrl: MenuController,
    private oneSignal: OneSignal,
    public fb: Facebook,
    private uniqueDeviceID: UniqueDeviceID
  ) {
    if (GLOBAL.IS_LOGGEDIN) {
      this.rootPage = 'HomePage';
    }
    this._user = GLOBAL.USER;
    this.events.subscribe('user:loggedin', (user) => {
      GLOBAL.IS_LOGGEDIN = true;
      GLOBAL.USER = user;
      this._user = user;
    });
    this.user.category().subscribe((resp: any) => {
      if (resp.status) {
        this.pages = resp.data;
      }
    }, (err) => {
    });

    platform.ready().then(() => {
      this.statusBar.backgroundColorByHexString('#0366fc');
      // this.statusBar.styleBlackOpaque()
      this.statusBar.styleBlackTranslucent()
      this.uniqueDeviceID.get().then((uuid: any) => {
        localStorage.setItem('device_id', uuid);
      }).catch((error: any) => console.log(error));

      this.oneSignal.getIds().then(identity => {
        localStorage.setItem('pushtoken', identity.pushToken);
        localStorage.setItem('devicetoken', identity.userId);
      }).catch((e) => {
        console.log("Error :" + e);
      })
        
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      try {
        this.networkprovider.initializeNetworkEvents();
      } catch (error) {
        console.log(error);
      }
      try {
        this.oneSignal.startInit(GLOBAL.ONESIGNAL_APPID, GLOBAL.SENDER_ID);
        this.oneSignal.inFocusDisplaying(0);
        
        this.oneSignal.handleNotificationReceived().subscribe(() => {
          // do something when notification is received
        });
        this.oneSignal.handleNotificationOpened().subscribe((x) => {
          this.handleNotification(x.notification.payload.additionalData);
        });
        this.oneSignal.endInit();
      } catch (error) {
        console.log('not supperted device or platform');
      }
      // this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
    this.initTranslate();
  }

  handleNotification(data) {
    this.nav.push('PostPage', { post: data.post });
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
    this.nav.setRoot('ProfilePage');
  }
  login() {
    this.nav.push('LoginPage');
  }

  logout() {
    GLOBAL.IS_LOGGEDIN = false;
    GLOBAL.USER = null;
    this._user = null;
    this.fb.logout()
      .then(res => GLOBAL.IS_LOGGEDIN = false)
      .catch(e => console.log('Error logout from Facebook', e));
    localStorage.removeItem('is_loggedin');
    this.nav.setRoot('LoginPage');
    this.menuCtrl.close();
  }
}
