import { Component, OnInit } from '@angular/core';
import { AssetService } from 'src/app/workshop/services/asset.service';
import { Router, ActivatedRoute } from '@angular/router';
import { catchError, take } from 'rxjs/operators';
import { Asset } from 'src/app/workshop/models/asset.model';
import { Account } from 'src/app/order/models/account.model';
import { WorkshopSubcontractorsService } from 'src/app/workshop/services/workshop-subcontractors.service';
import { WorkshopSubcontractors } from 'src/app/workshop/models/workshop-subcontractors.model';
import { Vehicle } from 'src/app/vehicle/models/vehicle.model';
import { Subcontractor } from 'src/app/subcontractor/models/subcontractor.model';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-view-assets',
  templateUrl: './view-assets.component.html',
  styleUrls: ['./view-assets.component.scss']
})
export class ViewAssetsComponent implements OnInit {
  asset: Vehicle = new Vehicle();
  assetList:any = [];
  linkedAssets: any = {data:{}};
  oldChildren: any = [];
  edit:boolean = false;
  categories: any = [];
  depots: any = [];
  assetId:number = -1;

  formSettings = {isVehicle:false,allowLink:true};

  pageRoute: string = '';

  constructor(
    private assetService: AssetService,
    private depotService: WorkshopSubcontractorsService,
    private router:Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.params.subscribe((params)=>{
      this.assetId = parseInt(params['id'])
      if(params['id'] === undefined){
        this.asset = new Vehicle();
        this.edit = true;

      } else {
        this.assetService.getAssetById(params['id'])
        .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;}alert('Could not retrieve Asset');return e;}))
        .pipe(take(1))
        .subscribe((asset:Asset) => {
          this.asset.asset = asset;
          this.asset.registration = this.asset.asset.asset;

          if(this.asset.asset.depot === null){
            this.asset.asset.depot = new Account();
            this.asset.asset.depot.name = 'Not Set';
          }
        })
        this.pageRoute = environment.publicUrl + '4workshop/assets/' + params['id'];
      }
    })
    this.loadContent();


  }

  loadContent(){
    this.assetService.getAllAssets()
    .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;}alert('Cannot get Items');return e;}))
    .pipe(take(1))
    .subscribe(assets => {
      this.assetList = assets;
    })

    if(this.assetId > 0){
      this.assetService.getVehicleByAssetId(this.assetId)
      .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;}alert('Could not retrieve Asset');return e;}))
      .pipe(take(1))
      .subscribe((asset: Vehicle) => {
        this.asset = asset[0];

        // if(this.asset.asset.depot === null){
        //   this.asset.asset.depot = new Account();
        //   this.asset.asset.depot.name = 'Not Set';
        // }

        if(this.asset.asset.categoryId === 1 ||  this.asset.asset.categoryId === 4){
          this.assetService.getAssetsByParent(this.assetId)
          .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;}alert('Could not get Child Assets');return e;}))
          .pipe(take(1))
          .subscribe((assetList:any) => {
            this.linkedAssets = {data:[]};
            assetList.forEach(item => {
              item.desc = item.asset + ' (' + item.category.name + ')'
              this.linkedAssets.data.push(item);
            })

            this.oldChildren = JSON.parse(JSON.stringify(assetList));
          });
        }
      })
    }
    this.assetService.getAssetCategories()
    .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;}alert('Could not get Categories');return e;}))
    .pipe(take(1))
    .subscribe(categories => {
      this.categories = categories;
    })

    this.depotService.getOwnDepots()
    .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;}alert('Could not get Categories');return e;}))
    .pipe(take(1))
    .subscribe(depots => {
      this.depots = depots;
    })

    if(this.assetId > 0){
      this.edit = false;
    }
  }

  save(){
    let targetAsset = this.asset.asset;
    targetAsset.asset = this.asset.registration;

    if(targetAsset.asset !== '' && targetAsset.categoryId > 0){
      if(targetAsset.id === -1 || targetAsset.id === undefined){
        // Create

        this.assetService.createAsset(targetAsset)
        .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;}alert('Could not Create');return e;}))
        .pipe(take(1))
        .subscribe(() => {
          this.router.navigateByUrl('/4workshop/asset-register');
        })
      } else {
        // Save

        this.assetService.saveAsset(targetAsset)
        .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;}alert('Could not Save');return e;}))
        .pipe(take(1))
        .subscribe(() => {
          this.updateChildren();
        })
      }
    } else {
      alert('Please fill in Asset Name and Category')
    }
  }

  updateChildren(){
    if(this.oldChildren.length > 0){
      this.oldChildren.forEach(oldItem => {
        oldItem.parentId = -1;
      })

      this.assetService.bulkAssetUpdate(this.oldChildren)
      .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;}alert('Could not delete existing Children');return e;}))
      .pipe(take(1))
      .subscribe(() => {
        this.addChildren();
      })
    } else {
      this.addChildren();
    }
  }

  addChildren(){
    if(this.linkedAssets.data.length > 0){
      this.linkedAssets.data.forEach(item => {
        item.parentId = this.assetId;
      })

      this.assetService.bulkAssetUpdate(this.linkedAssets.data)
      .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;}alert('Could not save Child Assets');return e;}))
      .pipe(take(1))
      .subscribe(()=>{
        // this.router.navigateByUrl('/4workshop/asset-register')
      })
    }
  }

  cancel(){
    if(confirm('Leave page and Discard data?')){
      this.router.navigateByUrl('/4workshop/asset-register')
    }
  }

  changeCategory(event){
    this.asset.asset.categoryId = parseInt(event.target.value,10);
    this.asset.asset.category.id = parseInt(event.target.value,10);
  }

  changeDepot(event){
    this.asset.asset.depotId = parseInt(event.target.value,10);
    this.asset.asset.depot.id = parseInt(event.target.value,10);
  }

}
