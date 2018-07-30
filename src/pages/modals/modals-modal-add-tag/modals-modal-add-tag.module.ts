import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalsModalAddTagPage } from './modals-modal-add-tag';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [
    ModalsModalAddTagPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalsModalAddTagPage),
    TranslateModule.forChild()
  ],
})
export class ModalsModalAddTagPageModule {}
