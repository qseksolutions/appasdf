import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-post',
  templateUrl: 'post.html',
})
export class PostPage {

  item: any;
  constructor(public navCtrl: NavController, navParams: NavParams) {
    this.item = navParams.get('item');
    console.log(this.item);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PostPage');
  }

}
