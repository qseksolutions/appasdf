import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalAddImageFromGalleryPage } from './modal-add-image-from-gallery';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ModalAddImageFromGalleryPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalAddImageFromGalleryPage),
    TranslateModule.forChild()
  ],
})
export class ModalAddImageFromGalleryPageModule {}
