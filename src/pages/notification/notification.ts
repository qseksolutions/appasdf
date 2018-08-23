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

  notification = [];
  user_id = GLOBAL.IS_LOGGEDIN ? GLOBAL.USER.id : '';
  
  constructor(public user: User, public navCtrl: NavController, public navParams: NavParams, public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad NotificationPage');
    this.viewCtrl.setBackButtonText('');
  }

  ionViewWillEnter() {
    this.user.getnotification(this.user_id).subscribe((resp: any) => {
      if (resp.status) {
        this.notification = resp.data;
        console.log(this.notification);
      }
    }, (err) => {
      console.log(err);
    });
  }

}