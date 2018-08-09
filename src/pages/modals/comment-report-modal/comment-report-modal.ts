import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, ToastController, ViewController, ModalController } from 'ionic-angular';
import { Posts } from '../../../providers/posts/posts';
import { GLOBAL } from '../../../app/global';

@IonicPage()
@Component({
  selector: 'page-comment-report-modal',
  templateUrl: 'comment-report-modal.html',
})
export class CommentReportModalPage {

  report_details: { id: number, reason: string, detail: string } = { id: 0, reason: '', detail: '' };


  constructor(
    public posts: Posts,
    public toastCtrl: ToastController,
    public navCtrl: NavController,
    public navParams: NavParams,
    public viewCtrl: ViewController,
    public modalCtrl: ModalController) {

    let rpost = navParams.get('rpost');
    this.report_details.id = rpost.id;

  }

  ionViewDidLoad() {

  }

  doReport() {
    if (GLOBAL.IS_LOGGEDIN) {
      return new Promise((resolve) => {
        this.posts.commentreport(this.report_details).subscribe((resp: any) => {
          if (resp.status) {
            this.report_details.reason = '';
            this.report_details.detail = '';

            let toast = this.toastCtrl.create({
              message: resp.message,
              duration: 5000,
              cssClass: 'toast-success',
              position: 'bottom'
            });
            toast.present();
            this.viewCtrl.dismiss(true);
          }
          resolve();
        }, (err) => {
          // Unable to log in
          console.log(err);
          resolve();
        });

      });
    }
    else {
      let toast = this.toastCtrl.create({
        message: 'Please Login First',
        duration: 3000,
        cssClass: 'toast-error',
        position: 'bottom'
      });
      toast.present();
    }
  }

  cancel() {
    this.viewCtrl.dismiss(false);
  }

}
