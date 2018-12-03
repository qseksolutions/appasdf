import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController, ToastController, ViewController } from 'ionic-angular';
import { InAppBrowser } from '@ionic-native/in-app-browser';

import { User } from '../../providers/user/user';
import { Settings } from '../../providers';
import { GLOBAL } from '../../app/global';
import { Events } from 'ionic-angular';
// import { TIMEOUT } from 'dns';

@IonicPage()
@Component({
  selector: 'page-settings',
  templateUrl: 'settings.html'
})
export class SettingsPage {
  // Our local settings object
  options: any;

  settingsReady = false;

  form: FormGroup;

  profileSettings = {
    page: 'profile',
    pageTitleKey: 'SETTINGS_PAGE_PROFILE'
  };

  page: string = 'main';
  pageTitleKey: string = 'SETTINGS_TITLE';
  pageTitle: string;

  subSettings: any = SettingsPage;

  constructor(public navCtrl: NavController,
    public settings: Settings,
    public formBuilder: FormBuilder,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public alertCtrl: AlertController,
    public loadingCtrl: LoadingController,
    public translate: TranslateService,
    public toastCtrl: ToastController,
    public user: User,
    public events: Events,
    private iab: InAppBrowser
  ) {
  }

  _buildForm() {
    let group: any = {
      option1: [this.options.option1],
      option2: [this.options.option2],
      option3: [this.options.option3]
    };

    switch (this.page) {
      case 'main':
        break;
      case 'profile':
        group = {
          option4: [this.options.option4]
        };
        break;
    }
    this.form = this.formBuilder.group(group);

    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.settings.merge(this.form.value);
    });
  }

  ionViewDidLoad() {
    // Build an empty form for the template to render
    this.form = this.formBuilder.group({});
    this.viewCtrl.setBackButtonText('');
  }

  ionViewWillEnter() {
    // Build an empty form for the template to render
    this.form = this.formBuilder.group({});

    this.page = this.navParams.get('page') || this.page;
    this.pageTitleKey = this.navParams.get('pageTitleKey') || this.pageTitleKey;

    this.translate.get(this.pageTitleKey).subscribe((res) => {
      this.pageTitle = res;
    })

    this.settings.load().then(() => {
      this.settingsReady = true;
      this.options = this.settings.allSettings;

      this._buildForm();
    });
  }

  logout() {
    GLOBAL.IS_LOGGEDIN = false;
    GLOBAL.USER = null;
    localStorage.removeItem('is_loggedin');
    this.events.publish('user:loggedin');
    this.navCtrl.setRoot('LoginPage');
  }

  gotoEditProfils() {
    this.navCtrl.push('EditProfilePage');
  }
  gotoChangepass() {
    this.navCtrl.push('ChangePasswordPage');
  }
  ngOnChanges() {
    console.log('Ng All Changes');
  }
  privacypolicy() {
    let browser = this.iab.create('http://fuskk.com/privacy/');
    // browser.executeScript(...);
    // browser.insertCSS(...);
    /* browser.on('loadstop').subscribe(event => {
      browser.insertCSS({ code: "body{color: red;" });
    }); */

    browser.close();
  }

  userdelete() {
    let alert = this.alertCtrl.create({
      title: 'Confirm Delete',
      message: 'Do you want delete this account?',
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            // alert.dismiss();
          }
        },
        {
          text: 'Delete account',
          handler: () => {
            let loading = this.loadingCtrl.create({
              content: 'Please wait...'
            });
            loading.present();
            this.user.deleteuser(GLOBAL.USER.id).subscribe((resp: any) => {
              if (resp.status) {
                GLOBAL.IS_LOGGEDIN = false;
                GLOBAL.USER = null;
                localStorage.removeItem('is_loggedin');
                let toast = this.toastCtrl.create({
                  message: resp.msg,
                  duration: 3000,
                  cssClass: 'toast-error',
                  position: 'bottom'
                });
                toast.present();
                loading.dismiss();
                GLOBAL.IS_LOGGEDIN = false;
                GLOBAL.USER = null;
                localStorage.removeItem('is_loggedin');
                this.events.publish('user:loggedin');
                this.navCtrl.setRoot('LoginPage');
              }
            }, (err) => {
              let toast = this.toastCtrl.create({
                message: err,
                duration: 3000,
                cssClass: 'toast-error',
                position: 'bottom'
              });
              toast.present();
              console.log(err);
            });
          }
        }
      ]
    });
    alert.present();
  }
}
