import 'rxjs/add/operator/toPromise';
import { Injectable } from '@angular/core';
import { Api } from '../api/api';
import { GLOBAL } from '../../app/global';

@Injectable()
export class Posts {
  user_id = '';
  header  = GLOBAL.API_HEADER;
  
  constructor(public api: Api) { 
    if (GLOBAL.IS_LOGGEDIN){
      this.user_id = GLOBAL.USER.id;
    }
  }

  postlist(fdata) {
    let body = new FormData();
    body.append('order_by', fdata.order);
    body.append('page', fdata.page);
    body.append('user_id', this.user_id);
    body.append('header', this.header);

    return this.api.post('postlist', body).share();
  }
 
  postlike(post_id) {
    let body = new FormData();
    body.append('post_id', post_id);
    body.append('user_id', this.user_id);
    body.append('header', this.header);

    return this.api.post('postlike', body).share();
  }
  
  commentlike(cmt) {
    let body = new FormData();
    body.append('comment_id', cmt.id);
    body.append('post_id', cmt.post_id);
    body.append('user_id', this.user_id);
    body.append('header', this.header);

    return this.api.post('commentlike', body).share();
  }
  
  addsubcomment(cmt) {
    let body = new FormData();
    body.append('comment_id', cmt.parent_id);
    body.append('post_id', cmt.post_id);
    body.append('comment', cmt.comment_text);
    body.append('user_id', this.user_id);
    body.append('header', this.header);

    return this.api.post('addsubcomment', body).share();
  }
  
  deletecomment(cmt) {
    let body = new FormData();
    body.append('id', cmt.id);
    body.append('user_id', this.user_id);
    body.append('header', this.header);

    return this.api.post('deletecomment', body).share();
  }
  
  postreport(report) {
    let body = new FormData();

    body.append('post_id', report.id);
    body.append('user_id', this.user_id);
    body.append('reason', report.reason);
    body.append('detail', report.detail);
    body.append('header', this.header);

    return this.api.post('postreport', body).share();
  }

  commentreport(report) {
    let body = new FormData();

    body.append('comment_id', report.id);
    body.append('user_id', this.user_id);
    body.append('reason', report.reason);
    body.append('detail', report.detail);
    body.append('header', this.header);

    return this.api.post('commentreport', body).share();
  }

  singlepost(post_id) {
    let body = new FormData();
    body.append('post_id', post_id);
    body.append('user_id', this.user_id);
    body.append('header', this.header);

    return this.api.post('singlepost', body).share();
  }

  loadmorecomment(post){
    let body = new FormData();

    body.append('post_id', post.id);
    body.append('page', post.page);
    body.append('user_id', this.user_id);
    body.append('header', this.header);

    return this.api.post('loadmorecomment', body).share();
  }
  
  loadsubcomment(cmt){
    let body = new FormData();

    body.append('comment_id', cmt.id);
    body.append('post_id', cmt.post_id);
    body.append('page', cmt.page);
    body.append('user_id', this.user_id);
    body.append('header', this.header);

    return this.api.post('loadsubcomment', body).share();
  }

}
