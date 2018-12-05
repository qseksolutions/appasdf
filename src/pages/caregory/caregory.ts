import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, PopoverController, AlertController, NavParams, ActionSheetController, ModalController, Slides, LoadingController, Events, ToastController } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Posts } from '../../providers/posts/posts';
import { GLOBAL } from '../../app/global';

import * as $ from "jquery";

@IonicPage()
@Component({
  selector: 'page-caregory',
  templateUrl: 'caregory.html',
})
export class CaregoryPage {

  @ViewChild('slider') slider: Slides;

  user_email = GLOBAL.IS_LOGGEDIN ? GLOBAL.USER.email : '';

  report_detail: any;
  user_id = GLOBAL.IS_LOGGEDIN ? GLOBAL.USER.id : '';

  Lfilter = { page: 1, cat_id: 0, tab: 0, is_last: false, order: 'id' };
  Hfilter = { page: 1, cat_id: 0, tab: 1, is_last: false, order: 'total_comment' };
  
  tabs = "0";
  
  Ldata = [];
  Hdata = [];
  category: any;

  constructor(
    public posts: Posts,
    public events: Events,
    public toastCtrl: ToastController,
    public navCtrl: NavController,
    public loadingCtrl: LoadingController,
    public popoverCtrl: PopoverController,
    public actionSheetCtrl: ActionSheetController,
    public modalCtrl: ModalController,
    public alertCtrl: AlertController,
    private socialSharing: SocialSharing,
    public navParams: NavParams) {

    this.category = this.navParams.get('category');
    try {
      this.Lfilter.cat_id = this.category.id;
      this.Hfilter.cat_id = this.category.id;
    } catch (error) {
      this.gotoHome();
    }
    
  }

  ionViewDidLoad() {
    this.categorypost(this.Lfilter);
    this.categorypost(this.Hfilter);
    $('.scroll-content').scroll(function (e) {
      // console.log('call');gotoProfile
      var offsetRange = $('.scroll-content').outerHeight(true) / 3,
        offsetTop = $('.scroll-content').scrollTop() + offsetRange + $("ion-header").outerHeight(true),
        offsetBottom = offsetTop + offsetRange + 250;

      $(".visible-video").each(function () {
        var y1 = $(this).offset().top;
        var y2 = offsetTop;
        if (y1 + $(this).outerHeight(true) < y2 || y1 > offsetBottom) {
          this.pause();
        } 
        else if (y1 < 0) {
          this.pause();
        }
        else {
          var newWidth = $(this).width();
          $(this).parent().css('width', newWidth);
          this.play();
        }
      });
    });
  }
  doRefresh(refresher){
    setTimeout(() => {
      refresher.complete();
    }, 1000);
    if (this.tabs == "0") {
      this.Lfilter.page = 1;
      this.categorypost(this.Lfilter);
    }
    else if (this.tabs == "1") {
      this.Hfilter.page = 1;
      this.categorypost(this.Hfilter);
    }
  }

  changed(idx) {
    this.slider.slideTo(idx);
  }

  doInfinite(): Promise<any> {
    
    return new Promise((resolve) => {

      let load_tab_data;
      if (this.tabs == "0") {
        this.Lfilter.page++;
        load_tab_data = this.Lfilter;
      }
      else if (this.tabs == "1") {
        this.Hfilter.page++;
        load_tab_data = this.Hfilter;
      }
      if (load_tab_data) {
        this.posts.postlist(load_tab_data, this.user_id).subscribe((resp: any) => {
          if (resp.status) {
            if (this.tabs == "0") {
              for (var i = 0; i < resp.data.length; i++) {
                this.Ldata.push(resp.data[i]);
              }
            }
            else if (this.tabs == "1") {
              for (var j = 0; j < resp.data.length; j++) {
                this.Hdata.push(resp.data[j]);
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

  changeTabs($event) {
    this.tabs = $event._snapIndex.toString();
  }

  categorypost(flt) {
    this.posts.categorypost(flt, this.user_id).subscribe((resp: any) => {
      if (resp.status) {
        if (flt.tab == 0) {
          this.Ldata = resp.data;
        }
        else if (flt.tab == 1) {
          this.Hdata = resp.data;
        }
      }
    }, (err) => {
      // Unable to log in
      console.log(err);
    });
  }

  

  addPost() {
    const actionSheet = this.actionSheetCtrl.create({
      // title: 'Modify your album',
      buttons: [
        {
          icon: 'images',
          text: 'Choose From Gallery',
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
          text: 'Paste Video URL',
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
    if (GLOBAL.IS_LOGGEDIN) {
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
    else {
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

  reportModal() {
    let model = this.modalCtrl.create('ReportModalPage', { rpost: this.report_detail });
    model.present();
    model.onDidDismiss((is_report) => {
      if (is_report) {
        this.events.publish('is_repost', this.report_detail);
      }
    });
  }

  share(post) {
    // Check if sharing via email is supported
    this.socialSharing.canShareViaEmail().then(() => {
      // Sharing via email is possible
      console.log('haring via email is possible');
    }).catch((e) => {
      console.log(e, 'Sharing via email is not possible');
      // Sharing via email is not possible
    });

    // Share via email
    this.socialSharing.shareViaEmail('https://fuskk.com/' + post.post_slug, post.title, [this.user_email]).then(() => {
      // Success!
      console.log('Success!');
    }).catch((e) => {
      // Error!
      console.log(e, 'Error!');
    });
  }

  gotoHome() {

    this.navCtrl.setRoot('HomePage');
  }

  gotoProfile() {

    this.navCtrl.push('ProfilePage');
  }

  gotoNotification() {
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
