import 'rxjs/add/operator/toPromise';
import { Injectable } from '@angular/core';
import { Api } from '../api/api';
import { GLOBAL } from '../../app/global';
import { Events } from 'ionic-angular';

@Injectable()
export class User {

  user_id = '';
  header = GLOBAL.API_HEADER;

  constructor(public api: Api, public events: Events) {
    if (GLOBAL.IS_LOGGEDIN) {
      this.user_id = GLOBAL.USER.id;
    }
  }


  category() {
    return this.api.get('category', { header: GLOBAL.API_HEADER }).share();
  }

  /**
   * Send a POST request to our login endpoint with the data
   * the user entered on the form.
   */
  login(accountInfo: any) {
    let body = new FormData();
    body.append('email', accountInfo.email);
    body.append('password', accountInfo.password);
    body.append('header', GLOBAL.API_HEADER);

    let seq = this.api.post('login', body).share();

    seq.subscribe((res: any) => {
      // If the API returned a successful response, mark the user as logged in
      if (res.status == true) {
        this._loggedIn(res);
      } else {
      }
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
  }

  /**
   * Send a POST request to our signup endpoint with the data
   * the user entered on the form.
   */
  signup(accountInfo) {
    let body = new FormData();
    body.append('header', this.header);
    body.append('email', accountInfo.email);
    body.append('password', accountInfo.password);

    return this.api.post('register', body).share();
  }

  userpostlist(fdata, user_id) {
    let body = new FormData();
    body.append('order_by', fdata.order);
    body.append('page', fdata.page);
    body.append('user_id', user_id);
    body.append('header', this.header);

    return this.api.post('userprofile', body).share();
  }

  getuserdata(user_id) {
    let body = new FormData();
    body.append('user_id', user_id);
    body.append('header', this.header);

    return this.api.post('getuser', body).share();
  }
  
  getcountrylist() {
    return this.api.get('country', { header: GLOBAL.API_HEADER }).share();
  }
  
  getcategorylist() {
    return this.api.get('category', { header: GLOBAL.API_HEADER }).share();
  }

  updateuser(udata, user_id) {
    let body = new FormData();
    body.append('header', this.header);
    body.append('user_id', user_id);
    body.append('name', udata.username);
    body.append('username', udata.user_slug);
    body.append('email', udata.email);
    body.append('gender', udata.gender);
    body.append('dob', udata.dob);
    body.append('country', udata.country_id);
    body.append('about', udata.about_me);
    body.append('userimage', udata.newimage);

    return this.api.post('updateuser', body).share();
  }
  
  updatedevicetoken(user_id) {
    let body = new FormData();
    body.append('header', this.header);
    body.append('user_id', user_id);
    body.append('devicetoken', GLOBAL.DEVICETOKEN);
    body.append('device_id', GLOBAL.DEVICE_ID);

    return this.api.post('updatedevicetoken', body).share();
  }
  
  getnotification(user_id, page) {
    let body = new FormData();
    body.append('header', this.header);
    body.append('user_id', user_id);
    body.append('page', page);

    return this.api.post('notification', body).share();
  }
  
  changepassword(udata, user_id) {
    let body = new FormData();
    body.append('header', this.header);
    body.append('user_id', user_id);
    body.append('oldpassword', udata.oldpassword);
    body.append('newpassword', udata.newpassword);

    return this.api.post('changepassword', body).share();
  }

  addpost(post, user_id) {
    let body = new FormData();
    body.append('header', this.header);
    body.append('user_id', user_id);
    body.append('title', post.title);
    body.append('category', post.category);
    if (post.tag1 != '' && post.tag2 != '' && post.tag3 != '') {
      body.append('tags', post.tag1 + ',' + post.tag2 + ',' + post.tag3);
    }
    else if (post.tag1 != '' && post.tag2 != '') {
      body.append('tags', post.tag1 + ',' + post.tag2);
    }
    else if (post.tag1 != '') {
      body.append('tags', post.tag1);
    }
    if (post.image != '') {
      body.append('image_post', post.image);
    }
    if (post.image_url != '') {
      body.append('imageurl', post.image_url);
    }
    if (post.video != '') {
      body.append('video_post', post.video);
    }

    return this.api.post('uploadpost', body).share();
  }

  /**
   * Log the user out, which forgets the session
   */
  logout() {

  }

  /**
   * Process a login/signup response to store user data
   */
  _loggedIn(resp) {
    this.events.publish('user:loggedin', resp.data);
    localStorage.setItem('is_loggedin', JSON.stringify(resp.data));
  }
}
