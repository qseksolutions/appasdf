import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, AlertController } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';

@IonicPage()
@Component({
  selector: 'page-letest',
  templateUrl: 'letest.html',
})
export class LetestPage {
  cardItems: any[];
  constructor(
    public navCtrl: NavController, 
    public popoverCtrl: PopoverController,
    public alertCtrl: AlertController,
    private socialSharing: SocialSharing,
    public navParams: NavParams) {
    this.cardItems = [
      {
        user: {
          avatar: 'assets/img/marty-avatar.png',
          name: 'Marty McFly'
        },
        date: 'November 5, 1955',
        image: 'assets/img/advance-card-bttf.png',
        content: 'Wait a minute. Wait a minute, Doc. Uhhh... Are you telling me that you built a time machine... out of a DeLorean?! Whoa. This is heavy.',
      },
      {
        user: {
          avatar: 'assets/img/sarah-avatar.png.jpeg',
          name: 'Sarah Connor'
        },
        date: 'May 12, 1984',
        image: 'assets/img/advance-card-tmntr.jpg',
        content: 'I face the unknown future, with a sense of hope. Because if a machine, a Terminator, can learn the value of human life, maybe we can too.'
      },
      {
        user: {
          avatar: 'assets/img/ian-avatar.png',
          name: 'Dr. Ian Malcolm'
        },
        date: 'June 28, 1990',
        image: 'assets/img/advance-card-jp.jpg',
        content: 'Your scientists were so preoccupied with whether or not they could, that they didn\'t stop to think if they should.'
      }
    ];
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad LetestPage');
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
}
