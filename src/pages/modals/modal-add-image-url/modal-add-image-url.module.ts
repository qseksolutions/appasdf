import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalAddImageUrlPage } from './modal-add-image-url';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ModalAddImageUrlPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalAddImageUrlPage),
    TranslateModule.forChild()
  ],
})
export class ModalAddImageUrlPageModule {}
