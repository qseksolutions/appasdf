import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController, AlertController, MenuController, LoadingController } from 'ionic-angular';
import { UniqueDeviceID } from '@ionic-native/unique-device-id';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import { GooglePlus } from '@ionic-native/google-plus';
import { Events } from 'ionic-angular';

import { User } from '../../providers';
import { GLOBAL } from '../../app/global';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
 
  account: { email: string, password: string } = {
    email: 'admin@qseksolutions.com',
    password: 'admin@1234'
  };
  user_id : any;

  constructor(public navCtrl: NavController,
    public user: User,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController,
    public menuCtrl: MenuController,
    public loadingCtrl: LoadingController,
    public translateService: TranslateService,
    private uniqueDeviceID: UniqueDeviceID,
    public fb: Facebook,
    public events: Events,
    public googlePlus: GooglePlus
  ) {

    this.menuCtrl.swipeEnable(false);
  }

  // Attempt to login in through our User service
  doLogin() {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
    this.user.login(this.account).subscribe((resp: any) => {
      loading.dismiss();
      if (resp.status) {
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
  }

  doForgot() {
    let prompt = this.alertCtrl.create({
      title: 'Forgot Password',
      message: "Forgot your password",
      inputs: [
        {
          id: 'Email',
          name: 'Email',
          placeholder: 'Email Address'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Send',
          handler: data => {
            let loading = this.loadingCtrl.create({
              content: 'Please wait...'
            });
            loading.present();
            this.user.forgotpassword(data.Email).subscribe((resp: any) => {
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
        }
      ]
    });
    prompt.present();
  }

  goSignup() {
    this.navCtrl.setRoot('SignupPage');
  }
  
  skip() {
    this.navCtrl.setRoot('HomePage');
  }

  fbloginAction() {
    // Login with permissions
    this.fb.login(['public_profile', 'user_photos', 'email', 'user_birthday'])
      .then((res: FacebookLoginResponse) => {

        // The connection was successful
        if (res.status == "connected") {

          // Get user ID and Token
          // const fb_id = res.authResponse.userID;
          // const fb_token = res.authResponse.accessToken;

          // Get user infos from the API
          this.fb.api("/me?fields=id,first_name,last_name,email,gender,locale,picture.width(300).height(300)", []).then((user) => {
            this.fblogin(user);
          });

        }
        // An error occurred while loging-in
        else {

          console.log("An error occurred...");

        }

      })
      .catch((e) => {
        console.log('Error logging into Facebook', e);
      });
  }

  fblogin(fbuser) {
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
    this.user.socialloginapi(fbuser,'facebook').subscribe((resp: any) => {
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

  googlelogin(){
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
      this.user.socialloginapi(user,'google').subscribe((resp: any) => {
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
