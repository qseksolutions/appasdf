import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, AlertController, ActionSheetController, ModalController, ViewController, ToastController } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Posts } from '../../providers/posts/posts';
import { GLOBAL } from '../../app/global';

@IonicPage()
@Component({
  selector: 'page-post',
  templateUrl: 'post.html',
})
export class PostPage {

  post_id: any;
  item: any;
  constructor(
    public posts: Posts,
    public toastCtrl: ToastController, 
    public navCtrl: NavController, 
    public popoverCtrl: PopoverController,
    private socialSharing: SocialSharing,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public viewCtrl: ViewController,
    public actionSheetCtrl: ActionSheetController ,
    navParams: NavParams) {
    this.post_id = navParams.get('post_id');
    
  }

  ionViewDidLoad() {
    this.viewCtrl.setBackButtonText('');

    this.posts.singlepost(this.post_id).subscribe((resp: any) => {
      if (resp.status) {
          this.item = resp.data;
        console.log(this.item);
      }
    }, (err) => {
      // Unable to log in
      console.log(err);
    });
  }

  report() {
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
    let model = this.modalCtrl.create('ReportModalPage');
    model.present()
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

  postlike(post): Promise<any> {
    if (GLOBAL.IS_LOGGEDIN) {
      return new Promise((resolve) => {
        this.posts.postlike(post.id).subscribe((resp: any) => {
          if (resp.status) {
            post.is_like = resp.like;
            post.like_count = resp.like_count;
          }
        }, (err) => {
          // Unable to log in
          console.log(err);
        });
        resolve();
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

}
