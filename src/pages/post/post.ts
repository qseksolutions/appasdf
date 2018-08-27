import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, PopoverController, AlertController, ActionSheetController, ModalController, ViewController, ToastController, Events } from 'ionic-angular';
import { SocialSharing } from '@ionic-native/social-sharing';
import { Posts } from '../../providers/posts/posts';
import { GLOBAL } from '../../app/global';

import * as $ from "jquery";
// import { convertDataToISO } from '../../../node_modules/ionic-angular/umd/util/datetime-util';

@IonicPage()
@Component({
  selector: 'page-post',
  templateUrl: 'post.html',
})
export class PostPage {

  user_email = GLOBAL.IS_LOGGEDIN?GLOBAL.USER.email:'';
  user_id = GLOBAL.IS_LOGGEDIN?GLOBAL.USER.id:'';
  
  post: any;
  item: any;
  report_detail: any;
  comment_report_detail: any;

  check_is_report = false;
  is_more_comment = false;

  comment_data:any;

  new_comment: { comment_text: string, comment_id: number, post_id: number, replay_type: number } = { comment_text: "", comment_id: 0, post_id: 0, replay_type: 0};
   
  constructor(
    public posts: Posts,
    private events: Events,
    public toastCtrl: ToastController, 
    public navCtrl: NavController, 
    public popoverCtrl: PopoverController,
    private socialSharing: SocialSharing,
    public alertCtrl: AlertController,
    public modalCtrl: ModalController,
    public viewCtrl: ViewController,
    public actionSheetCtrl: ActionSheetController ,
    navParams: NavParams) {
    this.post = navParams.get('post');
    
  }
  
  ionViewWillEnter(){
    
  }
  
  ionViewDidLoad() {
    this.viewCtrl.setBackButtonText('');
    try {
      this.posts.singlepost(this.post.id, this.user_id).subscribe((resp: any) => {
        if (resp.status) {
          this.item = resp.data;
          if (this.item.comments.length==10){
            this.is_more_comment = true; 
            this.item.page = 2;
          }
          else{
            this.is_more_comment = false; 
          }
        }
      }, (err) => {
        this.is_more_comment = false; 
        console.log(err);
      });
    } catch (error) {
      console.log(error);      
      this.navCtrl.setRoot('HomePage');
    }
  }


  replay_comment(cmt){
    console.log(cmt);
  }
  
  replay_addcomment(cmt) {
    if (this.is_login()) {
      console.log(cmt);

      this.comment_data     = cmt; 
      
      this.new_comment.comment_text = '@' + cmt.user_slug + ' ';
      
      this.new_comment.comment_text     = this.new_comment.comment_text;
      this.new_comment.comment_id       = cmt.id;
      this.new_comment.post_id          = cmt.post_id;
      this.new_comment.replay_type      = 1;
      
      $('input[name="comment_text"]').val(this.new_comment.comment_text).focus();
    }
  }

  replay_addsubcomment(cmt,subs_array){
    if (this.is_login()) 
    {
      this.comment_data                   = subs_array
      this.comment_data.details           = cmt;
      
      this.new_comment.comment_text = '@' + cmt.user_slug + ' ';

      this.new_comment.comment_text     = this.new_comment.comment_text;
      this.new_comment.comment_id       = cmt.parent_id;
      this.new_comment.post_id          = cmt.post_id;
      this.new_comment.replay_type      = 2;
      
      $('input[name="comment_text"]').val(this.new_comment.comment_text).focus();
    }
  }
  

  doComment(){
    if (this.is_login()){
      console.log(this.new_comment);
      if (this.new_comment.replay_type==1){
        return new Promise((resolve) => {
          this.posts.addsubcomment(this.new_comment, this.user_id).subscribe((resp: any) => {
            if (resp.status) {
              if (this.comment_data.subs){
                this.comment_data.subs.unshift(resp.data);
              }

              this.comment_data.sub_comment_count++;
              
              this.new_comment = { comment_text: "", comment_id: 0, post_id: 0, replay_type: 0 };
            }
            resolve();
          }, (err) => {
            console.log(err);
            resolve();
          });
        });
      }
      else if (this.new_comment.replay_type == 2) {
        return new Promise((resolve) => {
          this.posts.addsubcomment(this.new_comment, this.user_id).subscribe((resp: any) => {
            if (resp.status) {
              this.comment_data.sub_comment_count++;
              this.comment_data.subs.unshift(resp.data);

              this.new_comment = { comment_text: "", comment_id: 0, post_id: 0, replay_type: 0 };
            }
            resolve();
          }, (err) => {
            console.log(err);
            resolve();
          });
        });
      }
      else{
        this.new_comment.post_id = this.item.id;
        console.log(this.new_comment);
        return new Promise((resolve) => {
          this.posts.addcomment(this.new_comment, this.user_id).subscribe((resp: any) => {
            if (resp.status) {
              console.log(this.item.comments);
              this.item.comments.unshift(resp.data);
              this.post.total_comment++;

              this.new_comment = { comment_text: "", comment_id: 0, post_id: 0, replay_type: 0 };
            }
            resolve();
          }, (err) => {
            console.log(err);
            resolve();
          });
        });
      }
    }
  }

  deletecomment() {
    if (this.is_login()) {
      return new Promise((resolve) => {

        this.posts.deletecomment(this.comment_report_detail, this.user_id).subscribe((resp: any) => {
          if (resp.status) {
            if (this.comment_report_detail.cmt_type == "parent") {
              this.item.comments.splice(this.item.comments.indexOf(this.comment_report_detail), 1);
              this.post.total_comment--;
            }
            else {
              this.comment_report_detail.cmt_type.subs.splice(this.comment_report_detail.cmt_type.subs.indexOf(this.comment_report_detail), 1);
              this.comment_report_detail.cmt_type.sub_comment_count--;
            }
          }
          resolve();
        }, (err) => {
          console.log(err);
          resolve();
        });
      });
    }
  }

  focusCommentsInput(){
    setTimeout(() => {
      $('input[name="comment_text"]').focus();
    }, 1000);
  }

  gotoProfile(cmt_user_id) {
    this.navCtrl.push('ProfilePage', { user_id: cmt_user_id});
  }

  loadmorecomment(post){
    return new Promise((resolve) => {
      this.posts.loadmorecomment(post, this.user_id).subscribe((resp: any) => {
        if (resp.status) {
          for (var i = 0; i < resp.data.length; i++) {
            this.item.comments.push(resp.data[i]);
          }
          if (resp.data.lengt==10){
            this.item.page++;
          }
          else{
            this.is_more_comment = false;     
          }
        }
        resolve();
      }, (err) => {
        this.is_more_comment = false; 
        console.log(err);
        resolve();
      });
    });
  }

  loadsubcomment(cmt){
    cmt.page = 1;
    cmt.subs = [];
    cmt.is_more_comment = false;
    // if (this.is_login()) 
    {
      return new Promise((resolve) => {
        this.posts.loadsubcomment(cmt, this.user_id).subscribe((resp: any) => {
          if (resp.status) {
            cmt.subs = resp.data;
            if (resp.data.length == 10) {
              cmt.page++;
              cmt.is_more_comment = true;
            }
            else{
              cmt.is_more_comment = false;
            }
          }
          resolve();
        }, (err) => {
          cmt.is_more_comment = false;
          console.log(err);
          resolve();
        });
      });
    }
  }

  loadmoresubcomment(cmt) {
    // if (this.is_login()) 
    {
      return new Promise((resolve) => {
        this.posts.loadsubcomment(cmt, this.user_id).subscribe((resp: any) => {
          if (resp.status) {
            for (var i = 0; i < resp.data.length; i++) {
              cmt.subs.push(resp.data[i]);
            }
            if (resp.data.length == 10) {
              cmt.page++;
              cmt.is_more_comment = true;
            }
            else {
              cmt.is_more_comment = false;
            }
          }
          resolve();
        }, (err) => {
          cmt.is_more_comment = false;
          console.log(err);
          resolve();
        });
      });
    }
  }
  
  postreport(post) {
    if (this.is_login()) {
      this.report_detail = post;
      const actionSheet = this.actionSheetCtrl.create({
        buttons: [
          {
            text: 'Report Post',
            role: 'Report',
            handler: () => {
              this.reportModal();
            }
          },
          {
            text: 'Cancel',
            role: 'cancel',
            handler: () => {
              console.log('Cancel clicked');
            }
          }
        ]
      });
      actionSheet.present();
    }
  }

  reportModal() {
    if (this.check_is_report == false){
      let model = this.modalCtrl.create('ReportModalPage', { rpost: this.report_detail});
      model.present();
      model.onDidDismiss((is_report) => {
        if (is_report) {
          this.check_is_report = true;
          this.events.publish('is_repost', this.report_detail);
        }
      });
    }
    else{
      let toast = this.toastCtrl.create({
        message: 'You have already reported this post',
        duration: 3000,
        cssClass: 'toast-error',
        position: 'bottom'
      });
      toast.present();
    }
  }

  share(post) {
    // Check if sharing via email is supported
    this.socialSharing.share(post.title, post.title, post.media, 'https://fuskk.com/' + post.post_slug).then(() => {
      // Success!
      console.log('Success!');
    }).catch((e) => {
      // Error!
      console.log(e, 'Error!');
    });
  }

  postlike(post) {
    if (this.is_login()) {
      return new Promise((resolve) => {
        this.posts.postlike(post.id, post.user_id, this.user_id).subscribe((resp: any) => {
          if (resp.status) {
            post.is_like = resp.like;
            post.like_count = resp.like_count;
          }
          resolve();
        }, (err) => {
          console.log(err);
          resolve();
        });
        
      });
    }
  }

  commentlike(post) {
    if (this.is_login()) {
      return new Promise((resolve) => {
        this.posts.commentlike(post, this.user_id).subscribe((resp: any) => {
          if (resp.status) {
            post.comment_like = resp.like;
            post.comment_like_count = resp.like_count;
          }
          resolve();
        }, (err) => {
          console.log(err);
          resolve();
        });

      });
    }
  }

  is_login(){
    if (GLOBAL.IS_LOGGEDIN) {
      return true;
    }
    else {
      let toast = this.toastCtrl.create({
        message: 'Please Login First',
        duration: 3000,
        cssClass: 'toast-error',
        position: 'bottom'
      });
      toast.present();
      return false;
    }
  }

  report_or_delete(cmt,type) {
    if (this.is_login()) {
      this.comment_report_detail = cmt;
      this.comment_report_detail.cmt_type = type;
      if (cmt.user_id == this.user_id) {

        const actionSheet = this.actionSheetCtrl.create({
          buttons: [
            {
              text: 'Delete Comment',
              role: 'Report',
              handler: () => {
                this.deletecomment();
              }
            },
            {
              text: 'Cancel',
              role: 'cancel',
              handler: () => {
                console.log('Cancel clicked');
              }
            }
          ]
        });
        actionSheet.present();
      }
      else {
        
        const actionSheet = this.actionSheetCtrl.create({
          buttons: [
            {
              text: 'Report Comment',
              role: 'Report',
              handler: () => {
                this.commentreportModal();
              }
            },
            {
              text: 'Cancel',
              role: 'cancel',
              handler: () => {
                console.log('Cancel clicked');
              }
            }
          ]
        });
        actionSheet.present();
      }
    }
  }

  commentreportModal() {
    let model = this.modalCtrl.create('CommentReportModalPage', { rpost: this.comment_report_detail });
    model.present();
    model.onDidDismiss((is_comment_repost) => {
      if (is_comment_repost) {
        this.comment_report_detail.is_reported = 1;
      }
    });
  }
}
