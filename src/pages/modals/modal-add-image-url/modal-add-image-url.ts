import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, ViewController, ModalController, LoadingController, ToastController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-modal-add-image-url',
  templateUrl: 'modal-add-image-url.html',
})
export class ModalAddImageUrlPage {
  @ViewChild('fileInput') fileInput;

  isReadyToSave: boolean;

  item: any;

  post: { dis_image: string, image: string, video: string, dis_video: string, image_url: string, title: string, category: number, tag1: string, tag2: string, tag3: string } = { dis_image: '', image: '', video: '', dis_video: '', image_url: '', title: '', category: 1, tag1: '', tag2: '', tag3: '' };

  constructor(
    public navCtrl: NavController, 
    public viewCtrl: ViewController, 
    public modalCtrl: ModalController,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
  ) {
  }

  ionViewDidLoad() {

  }

  cancel() {
    this.viewCtrl.dismiss();
  }

  addPosttags() {
    if (this.post.title == '') {
      let toast = this.toastCtrl.create({
        message: "Please enter your post title",
        duration: 3000,
        cssClass: 'toast-success',
        position: 'bottom'
      });
      toast.present();
    }
    else if (this.post.image_url == '') {
      let toast = this.toastCtrl.create({
        message: "Please paste your image url",
        duration: 3000,
        cssClass: 'toast-success',
        position: 'bottom'
      });
      toast.present();
    }
    else {
      const image_modal = this.modalCtrl.create('ModalsModalAddTagPage', { post: this.post });
      image_modal.present();
    }
  }
}