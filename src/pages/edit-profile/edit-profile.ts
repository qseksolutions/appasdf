import { Component, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Camera } from '@ionic-native/camera';
import { IonicPage, NavController, ViewController, LoadingController, ToastController } from 'ionic-angular';
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
  user_id = GLOBAL.IS_LOGGEDIN ? GLOBAL.USER.id : '';

  item: any;

  form: FormGroup;

  constructor(
    public user: User,
    public navCtrl: NavController,
    public viewCtrl: ViewController,
    formBuilder: FormBuilder,
    public loadingCtrl: LoadingController,
    public toastCtrl: ToastController,
    public camera: Camera,
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

  // ionViewDidLoad() {
  //   this.viewCtrl.setBackButtonText('');
  // }

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
        this.userdata['newimage'] = '';
        this.userdata['userimage'] = '';
      }
    }, (err) => {
      console.log(err);
    });
  }

  getPicture() {
    
  }

  updateuser() {
    console.log(this.userdata);
    let loading = this.loadingCtrl.create({
      content: 'Please wait...'
    });
    loading.present();
    this.user.updateuser(this.userdata, this.user_id).subscribe((resp: any) => {
      loading.dismiss();
      if (resp.status) {
        this.userdata = resp.data;
        this.userdata['newimage'] = '';
        this.userdata['userimage'] = '';

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

  processWebImage(event) {
    if (event.target.files[0] && (event.target.files[0].type == 'image/png' || event.target.files[0].type == 'image/jpg' || event.target.files[0].type == 'image/jpeg')){
      this.userdata['newimage'] = event.srcElement.files[0];
      let reader = new FileReader();
      reader.onload = (readerEvent) => {
        
        let imageData = (readerEvent.target as any).result;
        this.userdata['userimage'] = imageData;
        this.form.patchValue({ 'profilePic': imageData });
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
    else{
      this.userdata['newimage'] = '';
      this.userdata['userimage'] = '';
    }
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
