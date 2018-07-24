import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, LoadingController, ModalController } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-profile',
  templateUrl: 'profile.html',
})
export class ProfilePage {
  details: any = [];
  members: any = [];

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public loadingCtrl: LoadingController,
    public modalCtrl: ModalController,
    ){
  }

  ionViewCanEnter() {
  }

  ionViewWillEnter() {
  }

  gotoSettings(){
    this.navCtrl.push('SettingsPage');
  }

  gotoViewProfile() {
    this.navCtrl.push('ViewProfilePage');
  }
  
  gotoPtabs(ptabs){
    this.navCtrl.push('ViewProfilePage', { ptabs: ptabs});
  }

  gotoEditProfils() {
    this.navCtrl.push('EditProfilePage');
  }
  
}