import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController, LoadingController } from 'ionic-angular';

import { User } from '../../providers';
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

  // Our translated text strings
  // private signupErrorString: string;

  constructor(public navCtrl: NavController,
    public user: User,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public translateService: TranslateService) {

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
}
