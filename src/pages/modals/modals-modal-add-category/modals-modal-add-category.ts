import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, LoadingController, ToastController, ViewController } from 'ionic-angular';
import { OneSignal } from '@ionic-native/onesignal';
import { User } from '../../../providers/user/user';
import { GLOBAL } from '../../../app/global';

/**
 * Generated class for the ModalsModalAddCategoryPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modals-modal-add-category',
  templateUrl: 'modals-modal-add-category.html',
})
export class ModalsModalAddCategoryPage {

  post = [];
  category = [];
  user_id = GLOBAL.IS_LOGGEDIN ? GLOBAL.USER.id : '';

  constructor(
    public user: User, 
    public navCtrl: NavController, 
    public navParams: NavParams, 
    private oneSignal: OneSignal,
    public modalCtrl: ModalController, 
    public viewCtrl: ViewController,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
  ) {
    this.post = navParams.get('post');
    console.log(this.post);
  }

  ionViewWillEnter() {
    this.user.getcategorylist().subscribe((resp: any) => {
      if (resp.status) {
        this.category = resp.data;
      }
    }, (err) => {
      console.log(err);
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalsModalAddCategoryPage');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }
  
  done() {
    console.log(this.post);
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
    this.user.addpost(this.post, this.user_id).subscribe((resp: any) => {
      loading.dismiss();
      if (resp.status) {
        setTimeout(() => {
          this.navCtrl.push('HomePage');
        }, 2000);

        let toast = this.toastCtrl.create({
          message: resp.message,
          duration: 3000,
          cssClass: 'toast-success',
          position: 'bottom'
        });
        toast.present();

        this.sendnotification(resp.devicetoken, resp.post_data, resp.notification);
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

  sendnotification(devicetoken, post, noti) {
    this.oneSignal.getIds().then(identity => {
      // alert(devicetoken);
      var notificationObj = {
        headings: { en: noti.heading },
        contents: { en: noti.msg },
        data: { post: post },
        include_player_ids: [devicetoken],
        android_accent_color: '0366fc',
        android_background_layout: { "headings_color": "0366fc" },
        small_icon: 'https://fuskk.com/images/small-icon',
        large_icon: noti.img,
        // ios_attachments: { id1: "https://cdn.pixabay.com/photo/2017/09/16/16/09/sea-2755908_960_720.jpg" }
      };

      window["plugins"].OneSignal.postNotification(notificationObj,
        function (successResponse) {
          // alert(JSON.stringify(successResponse));
          console.log("Notification Post Success:", successResponse);
        },
        function (failedResponse) {
          // console.log("Notification Post Failed: ", failedResponse);
          alert("Notification Post Failed:\n" + JSON.stringify(failedResponse));
        }
      );
    }).catch((e) => {
      console.log("Error :" + e);
    })
  }

}
