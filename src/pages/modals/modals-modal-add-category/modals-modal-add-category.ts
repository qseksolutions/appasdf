import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, LoadingController, ToastController, ViewController } from 'ionic-angular';
import { User } from '../../../providers/user/user';

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

  constructor(
    public user: User, 
    public navCtrl: NavController, 
    public navParams: NavParams, 
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
    this.user.addpost(this.post).subscribe((resp: any) => {
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

}
