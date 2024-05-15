import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, take } from 'rxjs/operators';
import { AccountService } from 'src/app/account/services/account.service';
import { Account } from 'src/app/order/models/account.model';
import { AssetService } from 'src/app/workshop/services/asset.service';
import { WorkshopSubcontractorsService } from 'src/app/workshop/services/workshop-subcontractors.service';
import { environment } from 'src/environments/environment';
import {Asset} from '../../../workshop/models/asset.model';

import { Vehicle } from '../../models/vehicle.model';

@Component({
  selector: 'app-asset-form',
  templateUrl: './asset-form.component.html',
  styleUrls: ['./asset-form.component.scss']
})
export class AssetFormComponent implements OnInit {
  @Input()
  vehicle: Vehicle = new Vehicle();
  @Input()
  formSettings: any = {};
  @Input()
  linkedAssets: any = {data:{}};
  @Input()
  allowLink:boolean = false;

  editToggle: boolean = true;
  categories:any = [];
  depots:any = [];

  dropdownSettings: any = {};
  assetList:any = [];
  parentAsset:any = {};

  constructor(
    private assetService:AssetService,
    private depotService: WorkshopSubcontractorsService,
    private accountService: AccountService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.assetService.getAssetCategories()
    .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;};alert('Could not get categories');return e;}))
    .pipe(take(1))
    .subscribe(categories => {
      this.categories = categories;
    })

    this.accountService.getAllDepots()
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('depots could not be loaded');
      return e;
    }))
    .pipe(take(1))
    .subscribe((depots: Account[]) => {
      this.depots = depots;
    });

    if(this.vehicle.depotId === -1){
      this.vehicle.depotId = environment.defaults.defaultVehicleDepot;
      this.vehicle.depot.id = environment.defaults.defaultVehicleDepot;
    }
    this.assetService.getAllAssetsButNotThisOneOrVehicles(this.vehicle.asset.id)
    .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;}alert('Could not get categories');return e;}))
    .pipe(take(1))
    .subscribe((assets:any) => {

      this.assetList = assets.filter(f=>(f.parentId === -1 || f.parentId === this.vehicle.asset.id)&&this.vehicle.asset.id !== f.id);

      this.assetList.forEach(item => {
        // if(item.asset.)
        item.desc = item.asset + ' (' + item.category.name + ')'
      })

      if(this.vehicle.asset.parentId !== -1){
        this.assetService.getAssetById(this.vehicle.asset.parentId)
        .pipe(catchError((e)=>{
          if(e.status === 403 || e.status === 401){return e;}
          alert('Could not get Parent')
          return e;
        }))
        .pipe(take(1))
        .subscribe((parent:Asset)=>{
          this.parentAsset = parent;
        })
      }
    })

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'desc',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 20,
      allowSearchFilter: true
    };
  }

  ngOnChanges(changes: SimpleChanges){
    if(changes.vehicle !== undefined){
      if(changes.vehicle.currentValue.id !== -1){

        if(this.vehicle.depotId === -1){
          this.vehicle.depotId = environment.defaults.defaultVehicleDepot;
          this.vehicle.depot.id = environment.defaults.defaultVehicleDepot;
        }
        this.assetService.getAllAssetsButNotThisOneOrVehicles(this.vehicle.asset.id)
        .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;}alert('Could not get categories');return e;}))
        .pipe(take(1))
        .subscribe((assets:any) => {

          this.assetList = assets.filter(f=>(f.parentId === -1 || f.parentId === this.vehicle.asset.id)&&this.vehicle.asset.id !== f.id);

          this.assetList.forEach(item => {
            // if(item.asset.)
            item.desc = item.asset + ' (' + item.category.name + ')'
          })

          if(this.vehicle.asset.parentId !== -1){
            this.assetService.getAssetById(this.vehicle.asset.parentId)
            .pipe(catchError((e)=>{
              if(e.status === 403 || e.status === 401){return e;}
              alert('Could not get Parent')
              return e;
            }))
            .pipe(take(1))
            .subscribe((parent:Asset)=>{
              this.parentAsset = parent;
            })
          }
        })
      }
    }
  }

  changeDepot(event){
    this.vehicle.asset.depotId = parseInt(event.target.value,10);
    this.vehicle.asset.depot = {id:parseInt(event.target.value,10)} as any;
  }

  changeCategory(event){
    this.vehicle.asset.categoryId = parseInt(event.target.value,10);
    this.vehicle.asset.category = {id:this.vehicle.asset.categoryId}as any;
    this.vehicle.asset.entity = this.categories.filter(f=>f.id === this.vehicle.asset.categoryId)[0].entity;
  }

  onItemSelect(item: any) {
  }
  onSelectAll(items: any) {
  }

  openAsset(id:number){
    const url = this.router.serializeUrl(
      this.router.createUrlTree([`${"/4workshop/assets/" + id}`])
    );

    window.open(url, '_blank');
  }

}
