import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ViewController} from 'ionic-angular';

/**
 * Generated class for the ModalsModalAddTagPage page.
 *
 * See https://ionicframework.com/docs/components/#navigation for more info on
 * Ionic pages and navigation.
 */

@IonicPage()
@Component({
  selector: 'page-modals-modal-add-tag',
  templateUrl: 'modals-modal-add-tag.html',
})
export class ModalsModalAddTagPage {
  post = [];
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams, 
    public modalCtrl: ModalController, 
    public  viewCtrl: ViewController,
  ) {
    this.post = navParams.get('post');
    console.log(this.post);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalsModalAddTagPage');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  goCatelist() {
    const image_modal = this.modalCtrl.create('ModalsModalAddCategoryPage', { post: this.post });
    image_modal.present();
  }

}
