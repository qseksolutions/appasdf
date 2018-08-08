import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, AlertController, ActionSheetController, ModalController, ViewController, ToastController, Events } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Posts } from '../../providers/posts/posts';
import { GLOBAL } from '../../app/global';

@IonicPage()
@Component({
  selector: 'page-post',
  templateUrl: 'post.html',
})
export class PostPage {

  post: any;
  item: any;
  report_detail: any;

  check_is_report = false;

  constructor(
    public posts: Posts,
    private events: Events,
    public toastCtrl: ToastController, 
    public navCtrl: NavController, 
    public popoverCtrl: PopoverController,
    private socialSharing: SocialSharing,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public viewCtrl: ViewController,
    public actionSheetCtrl: ActionSheetController ,
    navParams: NavParams) {
    this.post = navParams.get('post');
    
  }
  
  ionViewWillEnter(){
    
  }
  
  ionViewDidLoad() {
    this.viewCtrl.setBackButtonText('');
    try {
      this.posts.singlepost(this.post.id).subscribe((resp: any) => {
        if (resp.status) {
          this.item = resp.data;
        }
      }, (err) => {
        // Unable to log in
        console.log(err);
      });
    } catch (error) {
      console.log(error);      
      this.navCtrl.setRoot('HomePage');
    }
  }

  replay_cumment(cmt){
    console.log(cmt); 
  }

  loadsubcomment(cmt){
    cmt.page = 1;
    cmt.subs = [];
    if (this.is_login()) {
      return new Promise((resolve) => {
        this.posts.loadsubcomment(cmt).subscribe((resp: any) => {
          if (resp.status) {
            cmt.subs = resp.data;
            // for (var i = 0; i < resp.data.length; i++) {
            //   cmt.subs.push(resp.data[i]);
            // }
          }
          resolve();
        }, (err) => {
          // Unable to log in
          console.log(err);
          resolve();
        });
      });
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
    if (this.check_is_report == false){
      let model = this.modalCtrl.create('ReportModalPage', { rpost: this.report_detail});
      model.present();
      model.onDidDismiss((is_report) => {
        if (is_report) {
          this.check_is_report = true;
          this.events.publish('is_repost', this.report_detail);
        }
      });
    }
    else{
      let toast = this.toastCtrl.create({
        message: 'You have already reported this post',
        duration: 3000,
        cssClass: 'toast-error',
        position: 'bottom'
      });
      toast.present();
    }
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

  postlike(post) {
    if (this.is_login()) {
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
  }

  is_login(){
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
