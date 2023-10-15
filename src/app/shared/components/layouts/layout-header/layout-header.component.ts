// Angular modules
import {Component, Inject} from '@angular/core';
import { OnInit }      from '@angular/core';
import { Router }      from '@angular/router';
import { DOCUMENT } from '@angular/common';

// Internal modules
import { environment } from '@env/environment';
import { StorageHelper } from '@helpers/storage.helper';
import { AppService } from '@services/app.service';
@Component({
  selector    : 'app-layout-header',
  templateUrl : './layout-header.component.html',
  styleUrls   : ['./layout-header.component.scss']
})
export class LayoutHeaderComponent implements OnInit
{
  public appName         : string  = environment.appName;
  public isMenuCollapsed : boolean = true;
  public user:any;
  isCollapsed = true;
  fullScreenIcon: string = "";
  username: any
  profilePicture: any = null

  constructor ( private router : Router, private httpService: AppService, @Inject(DOCUMENT) private document: any) {}
  elem: any;

  ngOnInit(): void {
    this.initialize();
    this.fullScreenIcon = StorageHelper.getFullScreen().icon
    this.elem = document.documentElement;
  }

  async initialize(){
    this.username = StorageHelper.getUserDtls().employeeName
    if(StorageHelper.getUserDtls().employeeImage != ""){
      this.profilePicture = StorageHelper.getUserDtls().employeeImage
    }
  }

  public async onClickLogout() : Promise<void> {
    if (!confirm('Are you sure you want to logout ?')) return;
    const response: any = await this.httpService.logout();
    if(response.data.statusCode === 1){
      while (StorageHelper.getToken()) {
        StorageHelper.removeToken();
        StorageHelper.removeMenu();
        StorageHelper.removeUser();
        StorageHelper.removeUserDtls();
        StorageHelper.removeFullScreen()
      }
      // StorageHelper.removeToken();
      // NOTE Redirect to login
      StorageHelper.clearItems();
      this.router.navigate(['/login']);
    }
  }


  toggleFullScreen(){
    let fullScreen = StorageHelper.getFullScreen().fullSize;
    if(!fullScreen){
      if (this.elem.requestFullscreen) {
        this.elem.requestFullscreen();
      } else if (this.elem.mozRequestFullScreen) {
        /* Firefox */
        this.elem.mozRequestFullScreen();
      } else if (this.elem.webkitRequestFullscreen) {
        /* Chrome, Safari and Opera */
        this.elem.webkitRequestFullscreen();
      } else if (this.elem.msRequestFullscreen) {
        /* IE/Edge */
        this.elem.msRequestFullscreen();
      }
      this.fullScreenIcon = '../../../../../assets/img/project/navbar/Minimize.svg'
    }
    else{
      if (this.document.exitFullscreen) {
        this.document.exitFullscreen();
      } else if (this.document.mozCancelFullScreen) {
        /* Firefox */
        this.document.mozCancelFullScreen();
      } else if (this.document.webkitExitFullscreen) {
        /* Chrome, Safari and Opera */
        this.document.webkitExitFullscreen();
      } else if (this.document.msExitFullscreen) {
        /* IE/Edge */
        this.document.msExitFullscreen();
      }
      this.fullScreenIcon = '../../../../../assets/img/project/navbar/maximize.png'
    }

    const fullScreenData = {
      icon: this.fullScreenIcon,
      fullSize: !fullScreen
    }
    StorageHelper.setFullScreen(fullScreenData)
  }
}
