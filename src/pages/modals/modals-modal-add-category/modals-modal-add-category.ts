import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ViewController } from 'ionic-angular';

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

  constructor(public navCtrl: NavController, public navParams: NavParams, public modalCtrl: ModalController, public viewCtrl: ViewController) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ModalsModalAddCategoryPage');
  }
  dismiss() {
    this.viewCtrl.dismiss();
  }
  
  done() {
    this.viewCtrl.dismiss();
  }

}
