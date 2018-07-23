import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, AlertController } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';

@IonicPage()
@Component({
  selector: 'page-post',
  templateUrl: 'post.html',
})
export class PostPage {

  item: any;
  constructor(
    public navCtrl: NavController, 
    public popoverCtrl: PopoverController,
    private socialSharing: SocialSharing,
    public alertCtrl: AlertController,
    navParams: NavParams) {
    this.item = navParams.get('item');
    console.log(this.item);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PostPage');
  }

  report() {
    console.log('call');
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

}
