import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalAddVideoUrlPage } from './modal-add-video-url';

@NgModule({
  declarations: [
    ModalAddVideoUrlPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalAddVideoUrlPage),
  ],
})
export class ModalAddVideoUrlPageModule {}
