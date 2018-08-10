import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Camera } from '@ionic-native/camera';
import { IonicPage, NavController, ViewController } from 'ionic-angular';
import { User } from '../../providers/user/user';
import { GLOBAL } from '../../app/global';

@IonicPage()
@Component({
  selector: 'page-edit-profile',
  templateUrl: 'edit-profile.html',
})
export class EditProfilePage {
  @ViewChild('fileInput') fileInput;

  isReadyToSave: boolean;
  country = [];
  userdata = [];

  item: any;

  form: FormGroup;

  constructor(
    public user: User,
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    formBuilder: FormBuilder,
    public camera: Camera
  ) {
    this.form = formBuilder.group({
      profilePic: [''],
      name: ['', Validators.required],
    });

    // Watch the form for changes, and
    this.form.valueChanges.subscribe((v) => {
      this.isReadyToSave = this.form.valid;
    });
  }

  /* ionViewDidLoad() {
    this.viewCtrl.setBackButtonText('');
  } */

  ionViewWillEnter() {
    this.user.getcountrylist().subscribe((resp: any) => {
      if (resp.status) {
        this.country = resp.data;
      }
    }, (err) => {
      console.log(err);
    });
    this.user.getuserdata(GLOBAL.USER.id).subscribe((resp: any) => {
      if (resp.status) {
        this.userdata = resp.data;
      }
    }, (err) => {
      console.log(err);
    });
  }

  getPicture() {
    if (Camera['installed']()) {
      this.camera.getPicture({
        destinationType: this.camera.DestinationType.DATA_URL,
        targetWidth: 96,
        targetHeight: 96
      }).then((data) => {
        this.form.patchValue({ 'profilePic': 'data:image/jpg;base64,' + data });
      }, (err) => {
        alert('Unable to take photo');
      })
    } else {
      this.fileInput.nativeElement.click();
    }
  }

  updateuser() {
    console.log(this.userdata);
  }

  processWebImage(event) {
    let reader = new FileReader();
    reader.onload = (readerEvent) => {

      let imageData = (readerEvent.target as any).result;
      this.form.patchValue({ 'profilePic': imageData });
    };

    reader.readAsDataURL(event.target.files[0]);
  }

  getProfileImageStyle() {
    return 'url(' + this.form.controls['profilePic'].value + ')'
  }

  /**
   * The user is done and wants to create the item, so return it
   * back to the presenter.
   */
  done() {
    this.navCtrl.pop();    
  }
}
