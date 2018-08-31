import { Component } from '@angular/core';
import { IonicPage, NavController, PopoverController, AlertController, NavParams, ActionSheetController, ModalController, LoadingController, ToastController, Events } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Posts } from '../../providers/posts/posts';
import { GLOBAL } from '../../app/global';

import * as $ from "jquery";

@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  user_email = GLOBAL.IS_LOGGEDIN ? GLOBAL.USER.email : '';
  user_id = GLOBAL.IS_LOGGEDIN ? GLOBAL.USER.id : '';
  notification : any;

  report_detail:any;
  login: boolean = false;

  Lfilter = { order: 'id', page: 1, tab: 'letest', is_last: false };
  Hfilter = { order: 'total_comment', page: 1, tab: 'hot', is_last: false };
  Tfilter = { order: 'like_count', page: 1, tab: 'trading', is_last: false };

  Ldata = [];
  Hdata = [];
  Tdata = [];

  _user: any[] = [];

  tabs = "letest";
  tab = "0";
  
  constructor(
    public posts: Posts,
    public events: Events,
    public toastCtrl: ToastController,
    public navCtrl: NavController,
    public popoverCtrl: PopoverController,
    public actionSheetCtrl: ActionSheetController,
    public modalCtrl: ModalController,
    public loadingCtrl: LoadingController,
    public alertCtrl: AlertController,
    private socialSharing: SocialSharing,
    public navParams: NavParams) {

    // postlist
    if (GLOBAL.IS_LOGGEDIN) {
      this.login = true;
    }
    this._user = GLOBAL.USER;
    this.events.subscribe('user:loggedin', (user) => {
      GLOBAL.IS_LOGGEDIN = true;
      GLOBAL.USER = user;
      this._user = user;
    });
    this.changed('letest');
  } 

  doRefresh(refresher) {
    setTimeout(() => {
      refresher.complete();
    }, 1000);
    if (this.tabs == "letest") {
      this.Lfilter.page = 1;
      this.postlist(this.Lfilter);
    }
    else if (this.tabs == "hot") {
      this.Hfilter.page = 1;
      this.postlist(this.Hfilter);
    }
    else if (this.tabs == "trading") {
      this.Hfilter.page = 1;
      this.postlist(this.Tfilter);
    }
  }

  changed(segment){
    this.Ldata = [];
    this.Hdata = [];
    this.Tdata = [];

    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();

    if (segment=='letest'){
      this.Lfilter = { order: 'id', page: 1, tab: 'letest', is_last: false };
      this.postlist(this.Lfilter);
      loading.dismiss();
    }
    else if (segment == 'hot') {
      this.Hfilter = { order: 'total_comment', page: 1, tab: 'hot', is_last: false };
      this.postlist(this.Hfilter);
      loading.dismiss();
    }
    else if (segment == 'trading') {
      this.Tfilter = { order: 'like_count', page: 1, tab: 'trading', is_last: false };
      this.postlist(this.Tfilter);
      loading.dismiss();
    }
    else{
      loading.dismiss();
    }
  }

  doInfinite(curent_tab): Promise<any> {
    return new Promise((resolve) => {

      let load_tab_data;
      if (curent_tab == 'letest') {
        this.Lfilter.page = this.Lfilter.page + 1;
        load_tab_data = this.Lfilter;
      }
      else if (curent_tab == 'hot') {
        this.Hfilter.page = this.Hfilter.page + 1;
        load_tab_data = this.Hfilter;
      }
      else if (curent_tab == 'trading') {
        this.Tfilter.page = this.Tfilter.page + 1;
        load_tab_data = this.Tfilter;
      }
      if (load_tab_data) {
        this.posts.postlist(load_tab_data, this.user_id).subscribe((resp: any) => {
          if (resp.status) {
            this.notification = resp.notification
            if (curent_tab == 'letest') {
              for (var i = 0; i < resp.data.length; i++) {
                this.Ldata.push(resp.data[i]);
              }
            }
            else if (curent_tab == 'hot') {
              for (var j = 0; j < resp.data.length; j++) {
                this.Hdata.push(resp.data[j]);
              }
            }
            else if (curent_tab == 'trading') {
              for (var k = 0; k < resp.data.length; k++) {
                this.Tdata.push(resp.data[k]);
              }
            }
          }
          resolve();
        }, (err) => {
          resolve();
          console.log(err);
        });
      }
      else {
        resolve();
      }
    });
  }

  postlist(flt) {
    this.posts.postlist(flt, this.user_id).subscribe((resp: any) => {
      if (resp.status) {
        this.notification = resp.notification
        if (flt.tab == 'letest') {
          this.Ldata = resp.data;
        }
        else if (flt.tab == 'hot') {
          this.Hdata = resp.data;
        }
        else if (flt.tab == 'trading') {
          this.Tdata = resp.data;
        }
      }
    }, (err) => {
      // Unable to log in
      console.log(err);
    });
  }

  ionViewDidLoad() {
    this.events.subscribe('is_repost', (is_repost) => {
      if (this.tabs == 'letest') {
        this.Ldata.splice(this.Ldata.indexOf(is_repost), 1);
      }
      else if (this.tabs == 'hot') {
        this.Hdata.splice(this.Hdata.indexOf(is_repost), 1);
      }
      else if (this.tabs == 'trading') {
        this.Tdata.splice(this.Tdata.indexOf(is_repost), 1);
      }
    });
    $('.scroll-content').scroll(function (e) {
      // console.log('call');gotoProfile
      var offsetRange = $('.scroll-content').height() / 3,
        offsetTop = $('.scroll-content').scrollTop() + offsetRange + $("ion-header").outerHeight(true),
        offsetBottom = offsetTop + offsetRange + 100;

      $(".visible-video").each(function () {
        var y1 = $(this).offset().top;
        var y2 = offsetTop;
        if (y1 + $(this).outerHeight(true) < y2 || y1 > offsetBottom) {
          this.pause();
        } else {
          var newWidth = $(this).width();
          $(this).parent().css('width', newWidth);
          this.play();
        }
      });
    });
  }

  addPost() {
    const actionSheet = this.actionSheetCtrl.create({
      // title: 'Modify your album',
      buttons: [
        {
          icon: 'images',
          text: 'Choose Image Gallery',
          role: 'gallery',
          handler: () => {
            this.addImageFromGalleryPost();
            console.log('Gallery clicked');
          }
        }, {
          icon: 'image',
          text: 'Paste Image URL',
          role: 'image',
          handler: () => {
            this.addImagePost();
            console.log('Image URL clicked');
          }
        }, {
          icon: 'videocam',
          text: 'Choose Video Gallery',
          role: 'video',
          handler: () => {
            this.addVideoPost();
            console.log('Video URL clicked');
          }
        }
      ]
    });
    actionSheet.present();
  }

  post(post) {
    this.navCtrl.push('PostPage', { post: post });
  }

  postlike(post): Promise<any> {
    if(GLOBAL.IS_LOGGEDIN){
      return new Promise((resolve) => {
        this.posts.postlike(post.id, post.user_id, this.user_id).subscribe((resp: any) => {
          if (resp.status) {
            post.is_like = resp.like;
            post.like_count = resp.like_count;
          }
          resolve();
        }, (err) => {
          // Unable to log in
          console.log(err);
          resolve();
        });
      });
    }
    else{
      let toast = this.toastCtrl.create({
        message: 'Please Login First',
        duration: 3000,
        cssClass: 'toast-error',
        position: 'bottom'
      });
      toast.present();
    }
  }

  postreport(post) {
    if (this.is_login()) {
      this.report_detail = post;
      const actionSheet = this.actionSheetCtrl.create({
        buttons: [
          {
            text: 'Report Post',
            role: 'Report',
            handler: () => {
              this.reportModal();
            }
          },
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          }
        ]
      });
      actionSheet.present();
    }
  }

  share(post) {
    // Check if sharing via email is supported
    this.socialSharing.share(post.title, post.title, post.media, 'https://fuskk.com/' + post.post_slug).then(() => {
      // Success!
      console.log('Success!');
    }).catch((e) => {
      // Error!
      console.log(e, 'Error!');
    });
  }

  reportModal() {
    let model = this.modalCtrl.create('ReportModalPage', { rpost: this.report_detail});
    model.present();
    model.onDidDismiss((is_report) => {
      if (is_report) {
        this.events.publish('is_repost', this.report_detail);       
      }
    });
  }
  
  gotoHome() {
    this.navCtrl.setRoot('HomePage');
  }

  gotoProfile() {
    this.navCtrl.setRoot('ProfilePage');
  }
  gotoLogin() {
    this.navCtrl.push('LoginPage');
  }

  gotoNotification() {
    this.notification = 0;
    this.navCtrl.push('NotificationPage');
  }

  gotoSearch() {
    this.navCtrl.push('SearchPage');
  }

  addImagePost() {
    const image_modal = this.modalCtrl.create('ModalAddImageUrlPage');
    image_modal.present();
  }

  addVideoPost() {
    const video_modal = this.modalCtrl.create('ModalAddVideoUrlPage');
    video_modal.present();

  }

  addImageFromGalleryPost() {
    const galler_modal = this.modalCtrl.create('ModalAddImageFromGalleryPage');
    galler_modal.present();
  }

  is_login() {
    if (GLOBAL.IS_LOGGEDIN) {
      return true;
    }
    else {
      let toast = this.toastCtrl.create({
        message: 'Please Login First',
        duration: 3000,
        cssClass: 'toast-error',
        position: 'bottom'
      });
      toast.present();
      return false;
    }
  }
}
