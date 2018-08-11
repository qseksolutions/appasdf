import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, PopoverController, AlertController, NavParams, ActionSheetController, ModalController, Slides, LoadingController } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Posts } from '../../providers/posts/posts';

@IonicPage()
@Component({
  selector: 'page-caregory',
  templateUrl: 'caregory.html',
})
export class CaregoryPage {

  @ViewChild('slider') slider: Slides;



  Lfilter = { page: 1, cat_id: 0, tab: 0, is_last: false, order: 'id' };
  Hfilter = { page: 1, cat_id: 0, tab: 1, is_last: false, order: 'total_comment' };
  
  tabs = "0";
  
  Ldata = [];
  Hdata = [];
  category: any;

  constructor(
    public posts: Posts,
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
        this.posts.postlist(load_tab_data).subscribe((resp: any) => {
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
    this.posts.categorypost(flt).subscribe((resp: any) => {
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

  post(item) {
    this.navCtrl.push('PostPage', { item: item });
  }

  report() {
    let alert = this.alertCtrl.create({
      title: 'Report',
      inputs: [
        {
          label: 'Spam',
          name: 'report',
          type: 'radio',
        },
        {
          label: 'Hatred and bullying',
          name: 'report',
          type: 'radio',
        },
        {
          label: 'Self-harm',
          name: 'report',
          type: 'radio',
        },
        {
          label: 'Violent, gory and harmful content',
          name: 'report',
          type: 'radio',
        },
        {
          label: 'Child porn',
          name: 'report',
          type: 'radio',
        },
        {
          label: 'Illegal activities (e.g drug uses)',
          name: 'report',
          type: 'radio',
        },
        {
          label: 'Deceptive content',
          name: 'report',
          type: 'radio',
        },
        {
          label: 'Copyright and trademark infringement',
          name: 'report',
          type: 'radio',
        },
        {
          label: 'I just don\'t like it',
          name: 'report',
          type: 'radio',
        },
      ],
      buttons: [
        {
          text: 'Ok',
          handler: data => {
            console.log('Ok');
          }
        },
        {
          text: 'Cancel',
          role: 'cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
      ]
    });
    alert.present();
  }

  share() {
    // Check if sharing via email is supported
    this.socialSharing.canShareViaEmail().then(() => {
      // Sharing via email is possible
      console.log('haring via email is possible');
    }).catch((e) => {
      console.log(e, 'Sharing via email is not possible');
      // Sharing via email is not possible
    });

    // Share via email
    this.socialSharing.shareViaEmail('Body', 'Subject', ['recipient@example.org']).then(() => {
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
