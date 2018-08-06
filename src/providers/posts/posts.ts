import 'rxjs/add/operator/toPromise';
import { Injectable } from '@angular/core';
import { Api } from '../api/api';
import { GLOBAL } from '../../app/global';

@Injectable()
export class Posts {

  constructor(public api: Api) { }

  postlist(fdata) {
    let body = new FormData();
    body.append('order_by', fdata.order);
    body.append('page', fdata.page);
    body.append('user_id', GLOBAL.USER.id);
    body.append('header', GLOBAL.API_HEADER);

    return this.api.post('postlist', body).share();
  }
 
  postlike(post_id) {
    let body = new FormData();
    body.append('post_id', post_id);
    body.append('user_id', GLOBAL.USER.id);
    body.append('header', GLOBAL.API_HEADER);

    return this.api.post('postlike', body).share();
  }

  singlepost(post_id) {
    let body = new FormData();
    body.append('post_id', post_id);
    body.append('user_id', GLOBAL.USER.id);
    body.append('header', GLOBAL.API_HEADER);

    return this.api.post('singlepost', body).share();
  }

}
