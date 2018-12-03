import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ViewController } from 'ionic-angular';
import { User } from '../../providers/user/user';
import { GLOBAL } from '../../app/global';

/**
 * Generated class for the NotificationPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-notification',
  templateUrl: 'notification.html',
})
export class NotificationPage {

  pennotification = [];
  notification = [];
  page = 1;
  nonoti : Boolean = false;
  show : Boolean = false;
  user_id = GLOBAL.IS_LOGGEDIN ? GLOBAL.USER.id : '';
  
  constructor(public user: User, public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotificationPage');
    this.viewCtrl.setBackButtonText('');
  }

  doInfinite(): Promise<any> {
    return new Promise((resolve) => {

      this.page = this.page + 1;
      this.user.getnotification(this.user_id, this.page).subscribe((resp: any) => {
        if (resp.status) {
          this.nonoti = false;
          for (var i = 0; i < resp.notification.length; i++) {
            this.notification.push(resp.notification[i]);
          }
        }
        resolve();
      }, (err) => {
        resolve();
        this.nonoti = true;
        console.log(err);
      });
    });
  }

  ionViewWillEnter() {
    this.user.getnotification(this.user_id, this.page).subscribe((resp: any) => {
      if (resp.status) {
        this.nonoti = false;
        this.show = true;
        this.notification = resp.notification;
        this.pennotification = resp.pennotification;
        console.log(this.notification);
      }
    }, (err) => {
      this.nonoti = true;
      this.show = true;
      console.log(err);
    });
  }

  post(post) {
    this.navCtrl.push('PostPage', { post: post });
  }

}