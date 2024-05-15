import { Component, OnInit } from '@angular/core';
import { AssetService } from 'src/app/workshop/services/asset.service';
import { catchError, take } from 'rxjs/operators';

@Component({
  selector: 'app-assetcategories',
  templateUrl: './assetcategories.component.html',
  styleUrls: ['./assetcategories.component.scss']
})
export class AssetcategoriesComponent implements OnInit {
  categories: any = [];
  disableButtons: boolean = false;

  constructor(
    private assetService: AssetService
  ) { }

  ngOnInit(): void {
    this.loadContent();
  }

  loadContent(){
    this.assetService.getAssetCategories()
    .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;}alert('Could not get categories');return e;}))
    .pipe(take(1))
    .subscribe(categories => {
      this.categories = categories;
      this.disableButtons = false;
    })
  }

  addRow(){
    this.disableButtons = true;

    const newRow = {
      name:'',
      entity:'',
      addToggle: true
    };
    this.categories.push(newRow)
  }

  saveRow(){
    this.categories.forEach(item => {
      if(item.addToggle){
        if(item.name !== '' && item.entity !== ''){
          if(item.id === -1 || item.id === undefined){
            // Create
            this.assetService.createAssetCategory(item)
            .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;}alert('Could not get categories');return e;}))
            .pipe(take(1))
            .subscribe(() => {
              this.loadContent();
            })
          } else {
            // update
            this.assetService.saveAssetCategory(item)
            .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;}alert('Could not get categories');return e;}))
            .pipe(take(1))
            .subscribe(() => {
              this.loadContent();
            })
          }
        }
      }
    })
  }

}
