import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { CommentReportModalPage } from './comment-report-modal';

@NgModule({
  declarations: [
    CommentReportModalPage,
  ],
  imports: [
    IonicPageModule.forChild(CommentReportModalPage),
  ],
})
export class CommentReportModalPageModule {}
