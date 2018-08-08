import { Component } from '@angular/core';
import { IonicPage, NavController, PopoverController, AlertController, NavParams, ActionSheetController, ModalController, LoadingController, ToastController, Events } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Posts } from '../../providers/posts/posts';
import { GLOBAL } from '../../app/global';



@IonicPage()
@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {

  report_detail:any;

  Lfilter = { order: 'id', page: 1, tab: 'letest', is_last: false };
  Hfilter = { order: 'total_comment', page: 1, tab: 'hot', is_last: false };
  Tfilter = { order: 'like_count', page: 1, tab: 'trading', is_last: false };

  Ldata = [];
  Hdata = [];
  Tdata = [];

  tabs = "letest";
  
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
    this.postlist(this.Lfilter);
  } 

  changed(segment){
    this.Ldata = [];
    this.Hdata = [];
    this.Tdata = [];

    if (segment=='letest'){
      this.Lfilter = { order: 'id', page: 1, tab: 'letest', is_last: false };
      this.postlist(this.Lfilter);
    }
    else if (segment == 'hot') {
      this.Hfilter = { order: 'total_comment', page: 1, tab: 'hot', is_last: false };
      this.postlist(this.Hfilter);
    }
    else if (segment == 'trading') {
      this.Tfilter = { order: 'like_count', page: 1, tab: 'trading', is_last: false };
      this.postlist(this.Tfilter);
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
        this.posts.postlist(load_tab_data).subscribe((resp: any) => {
          if (resp.status) {
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
    this.posts.postlist(flt).subscribe((resp: any) => {
      if (resp.status) {
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
    if(GLOBAL.IS_LOGGEDIN){
      return new Promise((resolve) => {
        this.posts.postlike(post.id).subscribe((resp: any) => {
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

  reportModal() {
    let model = this.modalCtrl.create('ReportModalPage', { rpost: this.report_detail});
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
    this.socialSharing.shareViaEmail('https://fuskk.com/' + post.tag_slug, post.title, [GLOBAL.USER.email]).then(() => {
      // Success!
      console.log('Success!');
    }).catch((e) => {
      // Error!
      console.log(e, 'Error!');
    });
  }

  gotoHome() {
    this.is_active = "home";
    this.navCtrl.setRoot('HomePage');
  }

  gotoProfile() {
    this.is_active = "profile";
    this.navCtrl.push('ProfilePage');
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
}
