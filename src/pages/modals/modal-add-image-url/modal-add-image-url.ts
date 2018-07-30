import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Camera } from '@ionic-native/camera';
import { IonicPage, NavController, ViewController, ModalController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-modal-add-image-url',
  templateUrl: 'modal-add-image-url.html',
})
export class ModalAddImageUrlPage {
  @ViewChild('fileInput') fileInput;

  isReadyToSave: boolean;

  item: any;

  form: FormGroup;

  constructor(public navCtrl: NavController, public viewCtrl: ViewController, formBuilder: FormBuilder, public camera: Camera, public modalCtrl: ModalController) {
    this.form = formBuilder.group({
      name: ['', Validators.required],
    });

    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }

  ionViewDidLoad() {

  }

  cancel() {
    this.viewCtrl.dismiss();
  }

  addPosttags() {
    const image_modal = this.modalCtrl.create('ModalsModalAddTagPage');
    image_modal.present();
  }

  done() {
    if (!this.form.valid) { return; }
    this.viewCtrl.dismiss(this.form.value);
  }
}