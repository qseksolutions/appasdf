import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { TranslateModule } from '@ngx-translate/core';
import { ModalAddImageUrlPage } from './modal-add-image-url';

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
