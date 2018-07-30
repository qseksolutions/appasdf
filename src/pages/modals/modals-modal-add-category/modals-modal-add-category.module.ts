import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { ModalsModalAddCategoryPage } from './modals-modal-add-category';

@NgModule({
  declarations: [
    ModalsModalAddCategoryPage,
  ],
  imports: [
    IonicPageModule.forChild(ModalsModalAddCategoryPage),
  ],
})
export class ModalsModalAddCategoryPageModule {}
