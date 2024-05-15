import { Component, OnInit } from '@angular/core';
import { User } from 'src/app/auth/models/user.model';
import { AuthService } from 'src/app/auth/services/auth.service';
import { UserValidatorService } from '../../validators/user-validator.service';
import { UserService } from 'src/app/user/services/user.service';
import { take, catchError } from 'rxjs/operators';
import { Dashboard } from 'src/app/home/models/dashboard.model';
import { DashboardService } from 'src/app/home/services/dashboard.service';
import { environment } from 'src/environments/environment';
import { Personalisation } from '../../models/personalisation.model';
import { UserSettingsService } from '../../services/user-settings.service';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss']
})
export class UserProfileComponent implements OnInit {
  personalisationSettings: Personalisation = new Personalisation();

  isError: boolean = false;
  isServerError: boolean = false;
  isSuccess: boolean = false;

  user: User = new User();
  dashboard: Dashboard = new Dashboard();
  dashboardOptions = environment.dashboardOptions;
  currentDashboard:any = [];
  selectOption = -1;

  constructor(private authService: AuthService,
    private userService: UserService,
    private userSettingsService: UserSettingsService,
    private dashService: DashboardService,
    private userValidator: UserValidatorService) { }

  ngOnInit(): void {
    this.user = this.authService.getUser();
    this.loadContent();
  }

  loadContent(){
    this.dashService.getActiveDashboardByUserId(this.user.id)
    .pipe(catchError((e)=>{
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not retrieve Dashboard Settings');return e;
    }))
    .pipe(take(1))
    .subscribe(dash => {
      this.currentDashboard = [];
      this.dashboard = dash[0];
      if(this.dashboard !== undefined){
        if(this.dashboard.slotId1 !== null && this.dashboard.slotId1 !== undefined){
          this.dashboardOptions.forEach(item => {
            const found = item.items.filter(f=>f.name === this.dashboard.slotId1)[0];
            if(found !== undefined){this.currentDashboard.push(found)}
          })
        }

        if(this.dashboard.slotId2 !== null){
          this.dashboardOptions.forEach(item => {
            const found = item.items.filter(f=>f.name === this.dashboard.slotId2 && this.dashboard.slotId2 !== undefined)[0];
            if(found !== undefined){this.currentDashboard.push(found)}
          })
        }

        if(this.dashboard.slotId3 !== null){
          this.dashboardOptions.forEach(item => {
            const found = item.items.filter(f=>f.name === this.dashboard.slotId3 && this.dashboard.slotId3 !== undefined)[0];
            if(found !== undefined){this.currentDashboard.push(found)}
          })
        }

        if(this.dashboard.slotId4 !== null){
          this.dashboardOptions.forEach(item => {
            const found = item.items.filter(f=>f.name === this.dashboard.slotId4 && this.dashboard.slotId4 !== undefined)[0];
            if(found !== undefined){this.currentDashboard.push(found)}
          })
        }

        if(this.dashboard.slotId5 !== null){
          this.dashboardOptions.forEach(item => {
            const found = item.items.filter(f=>f.name === this.dashboard.slotId5 && this.dashboard.slotId5 !== undefined)[0];
            if(found !== undefined){this.currentDashboard.push(found)}
          })
        }

        if(this.dashboard.slotId6 !== null){
          this.dashboardOptions.forEach(item => {
            const found = item.items.filter(f=>f.name === this.dashboard.slotId6 && this.dashboard.slotId6 !== undefined)[0];
            if(found !== undefined){this.currentDashboard.push(found)}
          })
        }
      }

    });

    this.userSettingsService.getSettingsByUserId(this.user.id)
    .pipe(catchError((e)=>{
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Cannot get user settings');return e;
    }))
    .pipe(take(1))
    .subscribe((settings:any) => {
      if(settings.length !== 0){
        this.personalisationSettings = settings[0];
      }
    })
  }

  saveProfile() {
    this.isError = false;
    this.isServerError = false;
    this.isSuccess = false;

    if(!this.userValidator.isValid(this.user)) {
      this.isError = true;
      return;
    }

    this.userService.updateUser(this.user)
    .pipe(take(1))
    .pipe(catchError((e) => {
      this.isServerError = true;
      return e;
    }))
    .subscribe((data) => {
      this.isSuccess = true;
    })
  }

  savePersonalisation() {
    this.isError = false;
    this.isServerError = false;
    this.isSuccess = false;

    if(this.personalisationSettings.userId === -1){
      this.personalisationSettings.userId = this.user.id;

      this.userSettingsService.createPersonalisation(this.personalisationSettings)
      .pipe(take(1))
      .pipe(catchError((e) => {
        this.isServerError = true;
        return e;
      }))
      .subscribe((data) => {
        this.isSuccess = true;
      })
    } else {
      this.userSettingsService.updatePersonalisation(this.personalisationSettings)
      .pipe(take(1))
      .pipe(catchError((e) => {
        this.isServerError = true;
        return e;
      }))
      .subscribe((data) => {
        this.isSuccess = true;
      })
    }
  }

  addItem(event){
    const itemId = parseInt(event.target.value,10);
    this.dashboardOptions.forEach(item => {
      const newItem = item.items.filter(f=>f.id === itemId)[0];
      if(newItem !== undefined){this.currentDashboard.push(newItem)}

    })
    this.selectOption = -1;

    this.updateList();
  }

  removeItem(id:number){
    let tempDash = [];
    let currentLength = this.currentDashboard.length;
    for(let i=0;i<currentLength;i++){
      if(this.currentDashboard[i].id !== id){
        tempDash.push(this.currentDashboard[i]);
      }
    }
    this.currentDashboard = [];
    this.currentDashboard = tempDash;
    this.updateList();
  }

  alreadyUsed(id:number){
    const total = this.currentDashboard.filter(f=>f.id===id);
    if(total.length === 0){
      return false;
    } else {
      return true;
    }
  }

  updateList(){
    // this adds back in the deleted item

    if(this.dashboard === undefined){
      this.dashboard = new Dashboard();
    }

    if(
      this.currentDashboard[0] !== undefined &&
      this.currentDashboard[0] !== null &&
      this.currentDashboard[0] !== ''
    ){
      this.dashboard.slotId1 = this.currentDashboard[0].name;
    } else {this.dashboard.slotId1 = null;}

    if(
      this.currentDashboard[1] !== undefined &&
      this.currentDashboard[1] !== null &&
      this.currentDashboard[1] !== ''
    ){
      this.dashboard.slotId2 = this.currentDashboard[1].name;
    } else {this.dashboard.slotId2 = null;}

    if(
      this.currentDashboard[2] !== undefined &&
      this.currentDashboard[2] !== null &&
      this.currentDashboard[2] !== ''
    ){
      this.dashboard.slotId3 = this.currentDashboard[2].name;
    } else {this.dashboard.slotId3 = null;}

    if(
      this.currentDashboard[3] !== undefined &&
      this.currentDashboard[3] !== null &&
      this.currentDashboard[3] !== ''
    ){
      this.dashboard.slotId4 = this.currentDashboard[3].name;
    } else {this.dashboard.slotId4 = null;}

    if(
      this.currentDashboard[4] !== undefined &&
      this.currentDashboard[4] !== null &&
      this.currentDashboard[4] !== ''
    ){
      this.dashboard.slotId5 = this.currentDashboard[4].name;
    } else {this.dashboard.slotId5 = null;}

    if(
      this.currentDashboard[5] !== undefined &&
      this.currentDashboard[5] !== null &&
      this.currentDashboard[5] !== ''
    ){
      this.dashboard.slotId6 = this.currentDashboard[5].name;
    } else {this.dashboard.slotId6 = null;}

    if(this.dashboard.id === -1 || this.dashboard.id === null || this.dashboard.id === undefined){
      // new one
      this.dashboard.userId = this.user.id;
      this.dashboard.active = true;
      this.dashService.create(this.dashboard)
      .pipe(catchError((e) => {
        if(e.status === 403 || e.status === 401) {
          return e;
        }
        alert('Could not create new dashboard');return e;
      }))
      .pipe(take(1))
      .subscribe(() => {
        this.loadContent();
      })
    } else {
      this.dashService.save(this.dashboard)
      .pipe(catchError((e) => {
        if(e.status === 403 || e.status === 401) {
          return e;
        }
        alert('Could not create new dashboard');return e;
      }))
      .pipe(take(1))
      .subscribe(() => {
        this.loadContent();
      });
    }
  }
}
