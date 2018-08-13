import { Component, ViewChild } from '@angular/core';
import { IonicPage, NavController, ViewController, ModalController, LoadingController, ToastController } from 'ionic-angular';

import * as $ from "jquery";

@IonicPage()
@Component({
    selector: 'page-modal-add-video-url',
    templateUrl: 'modal-add-video-url.html',
})
export class ModalAddVideoUrlPage {
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

  addPosttags() {
    if (this.post.title == '') {
      let toast = this.toastCtrl.create({
        message: 'Please enter post title',
        duration: 3000,
        cssClass: 'toast-error',
        position: 'bottom'
      });
      toast.present();
    }
    else if (this.post.dis_video == '') {
      let toast = this.toastCtrl.create({
        message: 'Please select image from gallery',
        duration: 3000,
        cssClass: 'toast-error',
        position: 'bottom'
      });
      toast.present();
    }
    else {
      const image_modal = this.modalCtrl.create('ModalsModalAddTagPage', { post: this.post });
      image_modal.present();
    }
  }

  /**
   * The user cancelled, so we dismiss without sending data back.
   */
  cancel() {
    this.viewCtrl.dismiss();
  }

  processWebImage(event) {
    if (event.target.files[0] && (event.target.files[0].type == 'video/mp4' || event.target.files[0].type == 'video/webm' || event.target.files[0].type == 'video/ogg')) {
      let loading = this.loadingCtrl.create({
        content: 'Please wait...'
      });
      loading.present();
      this.post.video = event.srcElement.files[0];
      let reader = new FileReader();
      reader.onload = (readerEvent) => {

        let videoData = (readerEvent.target as any).result;
        this.post.dis_video = videoData;
        // console.log('<embed src="' + videoData + '" />');
        setTimeout(() => {
          $('#embedvideo').html('<embed src="' + videoData + '" />');
          loading.dismiss();
        }, 1000);
        // this.form.patchValue({ 'profilePic': imageData });
      };
      reader.readAsDataURL(event.target.files[0]);
    } else if (event.target.files[0] && (event.target.files[0].type != 'video/mp4' || event.target.files[0].type != 'video/webm' || event.target.files[0].type != 'video/ogg')) {
      let toast = this.toastCtrl.create({
        message: 'Please select .mp4 or .webm or .ogg image only',
        duration: 3000,
        cssClass: 'toast-error',
        position: 'bottom'
      });
      toast.present();
    }
    else {
      this.post.dis_image = '';
      this.post.image = '';
    }
  }

  /**
   * The user is done and wants to create the item, so return it
   * back to the presenter.
   */
}