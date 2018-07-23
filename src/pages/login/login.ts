import { Component } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ToastController, AlertController } from 'ionic-angular';

import { User } from '../../providers';
// import { MainPage } from '../';

@IonicPage()
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  // The account fields for the login form.
  // If you're using the username field with or without email, make
  // sure to add it to the type
  account: { email: string, password: string } = {
    email: 'test@example.com',
    password: 'test'
  };

  // Our translated text strings
  // private loginErrorString: string;

  constructor(public navCtrl: NavController,
    public user: User,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController ,
    public translateService: TranslateService) {

    // this.translateService.get('LOGIN_ERROR').subscribe((value) => {
    //   this.loginErrorString = value;
    // })
  }

  // Attempt to login in through our User service
  doLogin() {
    this.navCtrl.setRoot('HomePage');
    // this.user.login(this.account).subscribe((resp) => {
    //   this.navCtrl.setRoot('HomePage');
    // }, (err) => {
    //   this.navCtrl.setRoot('HomePage');
    //   // Unable to log in
    //   let toast = this.toastCtrl.create({
    //     message: this.loginErrorString,
    //     duration: 3000,
    //     position: 'top'
    //   });
    //   toast.present();
    // });
  }

  doForgot() {
    let prompt = this.alertCtrl.create({
      title: 'Forgot Password',
      message: "Forgot your password",
      inputs: [
        {
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
            console.log('Send clicked');
          }
        }
      ]
    });
    prompt.present();
  }

  goSignup() {
    this.navCtrl.setRoot('SignupPage');
  }
}
