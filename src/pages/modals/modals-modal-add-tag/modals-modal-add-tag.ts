import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ModalController, ViewController} from 'ionic-angular';

// import * as $ from "jquery";
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
  dis_vid: any;
  post: { dis_image: string, image: string, video: string, dis_video: string, image_url: string, title: string, category: number, tag1: string, tag2: string, tag3: string } = { dis_image: '', image: '', video: '', dis_video: '', image_url: '', title: '', category: 1, tag1: '', tag2: '', tag3: '' };
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
