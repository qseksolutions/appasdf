import { Component } from '@angular/core';
import { FormBuilder} from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { IonicPage, NavController, ViewController, LoadingController, ToastController } from 'ionic-angular';
import { User } from '../../providers/user/user';
import { GLOBAL } from '../../app/global';

/**
 * Generated class for the ChangePasswordPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-change-password',
  templateUrl: 'change-password.html',
})
export class ChangePasswordPage {
  userdata = [];
  user_id = GLOBAL.IS_LOGGEDIN ? GLOBAL.USER.id : '';
  constructor(
    public user: User,
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public translate: TranslateService
  ) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ChangePasswordPage');
    this.viewCtrl.setBackButtonText('');
  }

  changepassword() {
    console.log(this.userdata);
    if (this.userdata['newpassword'] != this.userdata['conpassword']) {
      let toast = this.toastCtrl.create({
        message: "Password does't match",
        duration: 3000,
        cssClass: 'toast-success',
        position: 'bottom'
      });
      toast.present();
    }
    else {
      let loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });
      loading.present();
      this.user.changepassword(this.userdata, this.user_id).subscribe((resp: any) => {
        loading.dismiss();
        if (resp.status) {
          this.userdata['oldpassword'] = '';
          this.userdata['newpassword'] = '';
          this.userdata['conpassword'] = '';
          let toast = this.toastCtrl.create({
            message: resp.message,
            duration: 3000,
            cssClass: 'toast-success',
            position: 'bottom'
          });
          toast.present();
        }
      }, (err) => {
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

}
