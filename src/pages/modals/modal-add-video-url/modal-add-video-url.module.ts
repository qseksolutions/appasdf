import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { ModalAddVideoUrlPage } from './modal-add-video-url';

@NgModule({
  declarations: [
    ModalAddVideoUrlPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalAddVideoUrlPage),
    TranslateModule.forChild()
  ],
})
export class ModalAddVideoUrlPageModule {}
