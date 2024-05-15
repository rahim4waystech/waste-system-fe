import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { AssetCategory } from '../models/asset-category.model';
import { Asset } from '../models/asset.model';

@Injectable({
  providedIn: 'root'
})
export class AssetService {
  /**
  * Endpoint for http calls
  */
  private _endpoint: string = environment.api.endpoint;

  constructor(private httpClient: HttpClient) { }

  getAllAssets(){
    return this.httpClient.get(this._endpoint + 'asset-register');
  }

  getAssetById(id:number){
    return this.httpClient.get(this._endpoint + 'asset-register/' + id);
  }

  getVehicleByAssetId(id:number){
    return this.httpClient.get(this._endpoint + 'vehicle?filter=assetId||eq||' + id);
  }

  getAssetByPartId(id:number){
    return this.httpClient.get(this._endpoint + 'asset-register/?filter=partId||eq||' + id);
  }

  getAssetCategories(){
    return this.httpClient.get(this._endpoint + 'asset-category');
  }

  getPartCategory(){
    return this.httpClient.get(this._endpoint + 'asset-category?filter=name||eq||"Part"');
  }

  createAssetCategory(category:AssetCategory): Observable<AssetCategory> {
    if(!category) {
      throw new Error('defect service: you must supply a defect object for saving');
    }

    delete category.id;
    delete category.updatedAt;
    delete category.createdAt;

    return this.httpClient.post(this._endpoint + 'asset-category/',
    JSON.stringify(category),
    {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
      return <AssetCategory>data;
    }));
  }

  saveAssetCategory(category:AssetCategory): Observable<AssetCategory> {
    if(!category) {
      throw new Error('asset category service: you must supply a defect object for saving');
    }

    delete category.updatedAt;

    if(!category.id || category.id === -1) {
      throw new Error('asset category service: Cannot update a record without id');
    }

    return this.httpClient.put(this._endpoint + 'asset-category/' + category.id,
    JSON.stringify(category),
    {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
      return <AssetCategory>data;
    }));
  }

  createAsset(asset:Asset): Observable<Asset> {
    if(!asset) {
      throw new Error('Asset service: you must supply a Asset object for saving');
    }

    delete asset.id;
    delete asset.updatedAt;
    delete asset.createdAt;

    return this.httpClient.post(this._endpoint + 'asset-register/',
    JSON.stringify(asset),
    {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
      return <Asset>data;
    }));
  }

  saveAsset(asset:Asset): Observable<Asset> {
    if(!asset) {
      throw new Error('asset category service: you must supply a defect object for saving');
    }

    delete asset.updatedAt;

    // delete asset.depot;
    // asset.depot = {id:asset.depotId} as any;
    //
    // delete asset.category;
    // asset.category = {id:asset.categoryId} as any;

    if(!asset.id || asset.id === -1) {
      throw new Error('asset category service: Cannot update a record without id');
    }

    return this.httpClient.put(this._endpoint + 'asset-register/' + asset.id,
    JSON.stringify(asset),
    {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
      return <Asset>data;
    }));
  }

  getAllAssetsButNotThisOneOrVehicles(id:number){
    return this.httpClient.get(this._endpoint + 'asset-register?filter=id||ne||' + id + '&filter=categoryId||ne||1');
  }

  getAssetsByParent(id:number){
    return this.httpClient.get(this._endpoint + 'asset-register?filter=parentId||eq||' + id);
  }

  deleteAllForParentId(parentId: number) {
    if(!parentId || parentId === -1) {
      throw new Error('You must supply a valid id in deleteAllForParentId');
    }

    return this.httpClient.delete(this._endpoint + 'asset-register/deleteByParentId/' + parentId);
  }

  bulkAssetUpdate(assets:Asset[]){
    if(!assets) {
      throw new Error('You must provide a valid permission object in bulkAssetUpdate');
    }
      assets.forEach((assets: Asset) => {

      delete assets.updatedAt;
    })
      return this.httpClient.post(this._endpoint + 'asset-register/bulk',
    JSON.stringify({bulk: assets}),
    {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
      return <Asset[]>data;
    }));
  }

}
