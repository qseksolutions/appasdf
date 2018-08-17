import { Injectable } from '@angular/core';
import { AlertController, Platform } from 'ionic-angular';
import { Network } from '@ionic-native/network';


@Injectable()
export class NetworkProvider {
  online: boolean;
  Status: string;
  alert: any;

  constructor(public alertCtrl: AlertController,
    public network: Network,
    public platform: Platform,
  ) {
  }

  public initializeNetworkEvents(): void {

    // this.network.onDisconnect().subscribe(() => {
    //   if (this.previousStatus === ConnectionStatusEnum.Online) {
    //     this.eventCtrl.publish('network:offline');
    //   }
    //   this.previousStatus = ConnectionStatusEnum.Offline;
    // });
    // this.network.onConnect().subscribe(() => {
    //   if (this.previousStatus === ConnectionStatusEnum.Offline) {
    //     this.eventCtrl.publish('network:online');
    //   }
    //   this.previousStatus = ConnectionStatusEnum.Online;
    // });

    this.alert = this.alertCtrl.create({
      title: 'Disconnected',
      message: 'Please connect your device to internet',
      buttons: [
        {
          text: 'Close',
          handler: () => {
            this.platform.exitApp();
          }
        }
      ], enableBackdropDismiss: false
    });

    // if (!this.network.type) {
    //   this.online = false;
    //   this.Status = 'Disconnected';
    //   this.alert.present();
    // }

    this.network.onDisconnect().subscribe(res => {
      this.online = false;
      this.Status = 'Disconnected';
      this.alert.present();
    });

    this.network.onConnect().subscribe(res => {

      if (this.network.type == "unknown" || this.network.type == "none" || this.network.type == undefined) {
        // alert("The device is not online " + this.network.type);
        //console.log("The device is not online");
        this.online = false;
        this.Status = 'Disconnected';
        this.alert.present();
      } else {
        // alert("The device is online " + this.network.type);
        this.online = true;
        this.Status = 'Connected';
        this.alert.dismiss();
      }

      //define again alert
      this.alert = this.alertCtrl.create({
        title: 'Disconnected',
        message: 'Please connect your device to internet',
        buttons: [
          {
            text: 'Close',
            handler: () => {
              this.platform.exitApp();
            }
          }
        ], enableBackdropDismiss: false
      });
    });
  }

}