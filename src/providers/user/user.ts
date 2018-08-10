import 'rxjs/add/operator/toPromise';
import { Injectable } from '@angular/core';
import { Api } from '../api/api';
import { GLOBAL } from '../../app/global';

@Injectable()
export class User {

  user_id = '';
  header = GLOBAL.API_HEADER;

  constructor(public api: Api) {
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
  signup(accountInfo: any) {
    let seq = this.api.post('signup', accountInfo).share();

    seq.subscribe((res: any) => {
      // If the API returned a successful response, mark the user as logged in
      if (res.status == 'success') {
        this._loggedIn(res);
      }
    }, err => {
      console.error('ERROR', err);
    });

    return seq;
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

  /**
   * Log the user out, which forgets the session
   */
  logout() {

  }

  /**
   * Process a login/signup response to store user data
   */
  _loggedIn(resp) {
    localStorage.setItem('is_loggedin', JSON.stringify(resp.data));
  }
}
