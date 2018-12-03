import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController, LoadingController } from 'ionic-angular';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';
import { Facebook } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';
import { Events } from 'ionic-angular';

import { User } from '../../providers';
import { GLOBAL } from '../../app/global';
// import { MainPage } from '../';

@IonicPage()
@Component({
  selector: 'page-signup',
  templateUrl: 'signup.html'
})
export class SignupPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  account: { name: string, email: string, password: string } = {
    name: 'Test Human',
    email: 'test@example.com',
    password: 'test'
  };
  user_id: any;

  // Our translated text strings
  // private signupErrorString: string;

  constructor(public navCtrl: NavController,
    public user: User,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public translateService: TranslateService,
    private uniqueDeviceID: UniqueDeviceID,
    public fb: Facebook,
    public events: Events,
    public googlePlus: GooglePlus
    ) {

    this.translateService.get('SIGNUP_ERROR').subscribe((value) => {
      // this.signupErrorString = value;
    })
  }

  doSignup() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
    console.log(this.account);
    this.user.signup(this.account).subscribe((resp: any) => {
      loading.dismiss();
      if (resp.status) {
        this.navCtrl.setRoot('LoginPage');

        let toast = this.toastCtrl.create({
          message: resp.message,
          duration: 3000,
          cssClass: 'toast-success',
          position: 'bottom'
        });
        toast.present();
      }
    }, (err) => {
      // Unable to log in
      loading.dismiss();
      let toast = this.toastCtrl.create({
        message: err.error.message,
        duration: 3000,
        cssClass: 'toast-error',
        position: 'bottom'
      });
      toast.present();
    });
  }

  goLogin() {
    this.navCtrl.setRoot('LoginPage');
  }

  fblogin(fbuser) {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
    this.user.socialloginapi(fbuser, 'facebook').subscribe((resp: any) => {
      loading.dismiss();
      if (resp.status) {
        this.events.publish('user:loggedin', resp.data);
        localStorage.setItem('is_loggedin', JSON.stringify(resp.data));
        let toast = this.toastCtrl.create({
          message: resp.message,
          duration: 3000,
          cssClass: 'toast-success',
          position: 'bottom'
        });
        toast.present();

        this.uniqueDeviceID.get().then((uuid: any) => {
          localStorage.setItem('device_id', uuid);
        }).catch((error: any) => console.log(error));
        this.user_id = GLOBAL.IS_LOGGEDIN ? GLOBAL.USER.id : '';
        this.user.updatedevicetoken(this.user_id).subscribe((resp: any) => {
          if (resp.status) {
            // alert(resp.message)
          }
        });

        this.navCtrl.setRoot('HomePage');
      }
    }, (err) => {
      // Unable to log in
      loading.dismiss();
      let toast = this.toastCtrl.create({
        message: err.error.message,
        duration: 3000,
        cssClass: 'toast-error',
        position: 'bottom'
      });
      toast.present();
    });
  }

  fblogout() {
    this.fb.logout()
      .then(res => GLOBAL.IS_LOGGEDIN = false)
      .catch(e => console.log('Error logout from Facebook', e));
  }

  googlelogin() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
    this.googlePlus.login({
      'scopes': '', // optional, space-separated list of scopes, If not included or empty, defaults to `profile` and `email`.
      'webClientId': '542653054768-49ato2jined8be5nrcfgv82klam5vaa3.apps.googleusercontent.com', // optional clientId of your Web application from Credentials settings of your project - On Android, this MUST be included to get an idToken. On iOS, it is not required.
      'offline': true
    })
      .then((user) => {
        this.user.socialloginapi(user, 'google').subscribe((resp: any) => {
          loading.dismiss();
          if (resp.status) {
            this.events.publish('user:loggedin', resp.data);
            localStorage.setItem('is_loggedin', JSON.stringify(resp.data));
            this.navCtrl.setRoot('HomePage');
            let toast = this.toastCtrl.create({
              message: resp.message,
              duration: 3000,
              cssClass: 'toast-success',
              position: 'bottom'
            });
            toast.present();

            this.uniqueDeviceID.get().then((uuid: any) => {
              localStorage.setItem('device_id', uuid);
            }).catch((error: any) => console.log(error));
            this.user_id = GLOBAL.IS_LOGGEDIN ? GLOBAL.USER.id : '';
            this.user.updatedevicetoken(this.user_id).subscribe((resp: any) => {
              if (resp.status) {
                // alert(resp.message)
              }
            });

          }
        }, (err) => {
          // Unable to log in
          loading.dismiss();
          let toast = this.toastCtrl.create({
            message: err.error.message,
            duration: 3000,
            cssClass: 'toast-error',
            position: 'bottom'
          });
          toast.present();
        });
      }, (error) => {
        loading.dismiss();
      });
  }
}
