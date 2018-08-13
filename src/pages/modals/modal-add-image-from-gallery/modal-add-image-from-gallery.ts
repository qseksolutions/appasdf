import { Component, ViewChild } from '@angular/core';
import { Camera } from '@ionic-native/camera';
import { IonicPage, NavController, ViewController, ModalController, LoadingController, ToastController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-modal-add-image-from-gallery',
  templateUrl: 'modal-add-image-from-gallery.html',
})
export class ModalAddImageFromGalleryPage {
  @ViewChild('fileInput') fileInput;

  isReadyToSave: boolean;

  item: any;

  post: { dis_image: string, image: string, video: string, dis_video: string, image_url: string, title: string, category: number, tag1: string, tag2: string, tag3: string } = { dis_image: '', image: '', video: '', dis_video: '', image_url: '', title: '', category: 1, tag1: '', tag2: '', tag3: '' };

  constructor(
    public navCtrl: NavController, 
    public viewCtrl: ViewController, 
    public camera: Camera, 
    public modalCtrl: ModalController,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
  ) {
  }

  ionViewDidLoad() {

  }

  getPicture() {
    
  }

  processWebImage(event) {
    if (event.target.files[0] && (event.target.files[0].type == 'image/png' || event.target.files[0].type == 'image/jpg' || event.target.files[0].type == 'image/jpeg')) {
      this.post.image = event.srcElement.files[0];
      let reader = new FileReader();
      reader.onload = (readerEvent) => {

        let imageData = (readerEvent.target as any).result;
        this.post.dis_image = imageData;
        // this.form.patchValue({ 'profilePic': imageData });
      };
      reader.readAsDataURL(event.target.files[0]);
    } else if (event.target.files[0] && (event.target.files[0].type != 'image/png' || event.target.files[0].type != 'image/jpg' || event.target.files[0].type != 'image/jpeg')) {
      let toast = this.toastCtrl.create({
        message: 'Please select .jpg or .jpeg or .png image only',
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

  /* getProfileImageStyle() {
    return 'url(' + this.form.controls['profilePic'].value + ')'
  } */

  /**
   * The user cancelled, so we dismiss without sending data back.
   */
  cancel() {
    this.viewCtrl.dismiss();
  }

  addPosttags() {
    console.log(this.post);
    if (this.post.title == '') {
      let toast = this.toastCtrl.create({
        message: 'Please enter post title',
        duration: 3000,
        cssClass: 'toast-error',
        position: 'bottom'
      });
      toast.present();
    }
    else if (this.post.dis_image == '') {
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
   * The user is done and wants to create the item, so return it
   * back to the presenter.
   */
}
