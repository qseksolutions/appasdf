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

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController  , public  viewCtrl: ViewController,) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalsModalAddTagPage');
  }

  dismiss() {
    this.viewCtrl.dismiss();
  }

  goCatelist() {
    const image_modal = this.modalCtrl.create('ModalsModalAddCategoryPage');
    image_modal.present();
  }

}
