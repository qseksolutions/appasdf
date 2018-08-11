import { Component } from '@angular/core';
import { IonicPage, NavController, PopoverController, AlertController, NavParams, ActionSheetController, ModalController, LoadingController, ToastController, Events } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';
import { User } from '../../providers/user/user';
import { Posts } from '../../providers/posts/posts';
import { GLOBAL } from '../../app/global';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  cardItems: any[];
  details: any = [];
  members: any = [];
  ptabs = "overview";
  is_active = "home";
  report_detail: any;
  cuser: any;

  user_email = GLOBAL.IS_LOGGEDIN ? GLOBAL.USER.email : '';
  user_id = GLOBAL.IS_LOGGEDIN ? GLOBAL.USER.id : '';

  Ofilter = { order: '', page: 1, tab: 'overview', is_last: false };
  Pfilter = { order: 'posts', page: 1, tab: 'posts', is_last: false };
  Lfilter = { order: 'likes', page: 1, tab: 'likes', is_last: false };
  Cfilter = { order: 'comments', page: 1, tab: 'comments', is_last: false };

  Odata = [];
  Pdata = [];
  Ldata = [];
  Cdata = [];

 userdata = [];

  constructor(
    public user: User,
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
    public navParams: NavParams
  ) {
    this.cuser = this.navParams.get('user_id');
    if (this.cuser == undefined || this.cuser == '') {
      this.cuser = this.user_id;
    }
    
    this.changed('overview');
  }

  changed(segment) {
    this.Odata = [];
    this.Pdata = [];
    this.Ldata = [];
    this.Cdata = [];

    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();

    if (segment == 'overview') {
      this.Ofilter = { order: '', page: 1, tab: 'overview', is_last: false };
      this.postlist(this.Ofilter);
      loading.dismiss();
    }
    else if (segment == 'posts') {
      this.Pfilter = { order: 'posts', page: 1, tab: 'posts', is_last: false };
      this.postlist(this.Pfilter);
      loading.dismiss();
    }
    else if (segment == 'likes') {
      this.Lfilter = { order: 'likes', page: 1, tab: 'likes', is_last: false };
      this.postlist(this.Lfilter);
      loading.dismiss();
    }
    else if (segment == 'comments') {
      this.Cfilter = { order: 'comments', page: 1, tab: 'comments', is_last: false };
      this.postlist(this.Cfilter);
      loading.dismiss();
    }
    else {
      loading.dismiss();
    }
  }

  ionViewWillEnter() {
    this.user.getuserdata(this.cuser).subscribe((resp: any) => {
      if (resp.status) {
        this.userdata = resp.data;
      }
    }, (err) => {
      console.log(err);
    });
  }

  doInfinite(curent_tab): Promise<any> {
    return new Promise((resolve) => {

      let load_tab_data;
      if (curent_tab == 'overview') {
        this.Ofilter.page = this.Ofilter.page + 1;
        load_tab_data = this.Ofilter;
      }
      else if (curent_tab == 'posts') {
        this.Pfilter.page = this.Pfilter.page + 1;
        load_tab_data = this.Pfilter;
      }
      else if (curent_tab == 'likes') {
        this.Lfilter.page = this.Lfilter.page + 1;
        load_tab_data = this.Lfilter;
      }
      else if (curent_tab == 'comments') {
        this.Cfilter.page = this.Cfilter.page + 1;
        load_tab_data = this.Cfilter;
      }
      if (load_tab_data) {
        this.user.userpostlist(load_tab_data, this.cuser).subscribe((resp: any) => {
          if (resp.status) {
            if (curent_tab == 'overview') {
              for (var i = 0; i < resp.data.length; i++) {
                this.Odata.push(resp.data[i]);
              }
            }
            else if (curent_tab == 'posts') {
              for (var j = 0; j < resp.data.length; j++) {
                this.Pdata.push(resp.data[j]);
              }
            }
            else if (curent_tab == 'likes') {
              for (var k = 0; k < resp.data.length; k++) {
                this.Ldata.push(resp.data[k]);
              }
            }
            else if (curent_tab == 'comments') {
              for (var l = 0; l < resp.data.length; l++) {
                this.Cdata.push(resp.data[l]);
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
    this.user.userpostlist(flt, this.cuser).subscribe((resp: any) => {
      if (resp.status) {
        if (flt.tab == 'overview') {
          this.Odata = resp.data;
        }
        else if (flt.tab == 'posts') {
          this.Pdata = resp.data;
        }
        else if (flt.tab == 'likes') {
          this.Ldata = resp.data;
        }
        else if (flt.tab == 'comments') {
          this.Cdata = resp.data;
        }
      }
    }, (err) => {
      // Unable to log in
      console.log(err);
    });
  }

  post(post) {
    this.navCtrl.push('PostPage', { post: post });
  }

  postlike(post): Promise<any> {
    if (GLOBAL.IS_LOGGEDIN) {
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
 
  gotoSettings(){
    this.navCtrl.push('SettingsPage');
  }

  gotoViewProfile() {
    this.navCtrl.push('ViewProfilePage');
  }
  
  gotoPtabs(ptabs){
    this.navCtrl.push('ViewProfilePage', { ptabs: ptabs});
  }

  gotoEditProfils() {
    this.navCtrl.push('EditProfilePage');
  }
  
}