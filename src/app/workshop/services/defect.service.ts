import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Defect } from '../models/defect.model';
import { InspectionDates } from '../models/inspection-dates.model';
import * as moment from 'moment';
import { RequestQueryBuilder } from '@nestjsx/crud-request';
import { DefectAssignment } from 'src/app/timeline-transport/models/defect-assignment.model';
import { Fitter } from 'src/app/fitter/models/fitter.model';

@Injectable({
  providedIn: 'root'
})
export class DefectService {


  /**
  * Endpoint for http calls
  */
 private _endpoint: string = environment.api.endpoint;


 constructor(private httpClient: HttpClient) { }

  getAllDefects(): Observable<Defect[]> {
    return this.httpClient.get(this._endpoint + 'defects').pipe(map((data) => {
      return <Defect[]>data;
    }));
  }

  getAllDefectsList(): Observable<Defect[]> {
    return this.httpClient.get(this._endpoint + 'defects?filter=started||isnull&filter=ended||isnull&sort=vehicleSeverityId,ASC&limit=8').pipe(map((data) => {
      return <Defect[]>data;
    }));
  }

  getAllDefectsByDateForTimeline(date: string, search:string='', sort:string='bookedFor'): Observable<Defect[]> {

    if(!date || date === '') {
      throw new Error('Please provide a valid date for getAllDefectsByDateForTimeline');
    }

    date = moment(date).format('YYYY-MM-DD');

    const qb: RequestQueryBuilder = RequestQueryBuilder.create();
    // qb.setPage(page);
    // qb.setLimit(10); // amount per page
  //  qb.setFilter({field: 'bookedFor', operator: 'eq', value: '"' + date + '"'}) // only the date
   qb.setFilter({field: 'ended', operator: 'isnull'})



    if(sort === 'bookedFor') {
      qb.sortBy({field: 'bookedFor', order: "DESC"});
    }

    if(sort === "vehicleCheckArea") {
      qb.sortBy({field: 'vehicleCheckArea.name', order: "DESC"});
    }

    if(sort === "inspectionType") {
      qb.sortBy({field: "inspectionInterval.name", order: "DESC"});
    }

    if(search !== '') {

      qb.setFilter({field: 'description', operator: 'cont', value: search});
    }

    qb.setJoin(['vehicle.vehicleType']);

    return this.httpClient.get(this._endpoint + 'defects?' + qb.query()).pipe(map((data) => {
      return <Defect[]>data;
    }));
  }

  getDefectsByVehicleId(id:number,defectLimit:number): Observable<Defect[]> {
    return this.httpClient.get(this._endpoint + 'defects?filter=vehicleId||eq||' + id + '&filter=driverReportStatus||lte||1&limit=' + defectLimit).pipe(map((data) => {
      return <Defect[]>data;
    }));
  }

  getDefectsByVehicleIdAndInspectionId(vehicleId:number,inspectionId:number): Observable<Defect[]> {
    return this.httpClient.get(this._endpoint +
      'defects?filter=vehicleId||eq||' + vehicleId +
      '&filter=vehicleInspectionIntervalsId||eq||' + inspectionId +
      '&sort=id,DESC&limit=1'
    ).pipe(map((data) => {
      return <Defect[]>data;
    }));
  }

  getAllDefectsForDates(startDate,endDate): Observable<Defect[]> {
    return this.httpClient.get(this._endpoint + 'defects?filter=updatedAt||lte||'+endDate+'&filter=updatedAt||gte||'+startDate).pipe(map((data) => {
      return <Defect[]>data;
    }));
  }

  getDefectById(id:number): Observable<Defect[]> {
    return this.httpClient.get(this._endpoint + 'defects/' + id).pipe(map((data) => {
      return <Defect[]>data;
    }));
  }

  /**
   * creates a defect check in the backend based on defect object.
   * @param defect defect object.
   *
   * @returns Observable<Defect>
   */
  createDefect(defect: Defect): Observable<Defect> {
    if(!defect) {
      throw new Error('defect service: you must supply a defect object for saving');
    }

    delete defect.updatedAt;
    delete defect.createdAt;
    delete defect.id;

    return this.httpClient.post(this._endpoint + 'defects/',
    JSON.stringify(defect),
    {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
      return <Defect>data;
    }));
  }

    /**
     * updates a defect in the backend based on defect object.
     * @param defect defect object.
     *
     * @returns Observable<Defect>
     */
    saveDefect(defect: Defect): Observable<Defect> {

      if(!defect) {
        throw new Error('Defect service: you must supply a Defect object for saving');
      }

      delete defect.updatedAt;


      if(!defect.id || defect.id === -1) {
        throw new Error('vehicle check service: Cannot update a record without id');
      }

      return this.httpClient.put(this._endpoint + 'defects/' + defect.id,
      JSON.stringify(defect),
      {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
        return <Defect>data;
      }));
    }

    getHistoricInspectionDatesByVehicleId(vehicleId:number): Observable<InspectionDates[]> {
      return this.httpClient.get(this._endpoint + 'inspection-dates?filter=vehicleId||eq||'+vehicleId).pipe(map((data) => {
        return <InspectionDates[]>data;
      }));
    }

    addInspectionDate(inspection: InspectionDates): Observable<InspectionDates> {
      if(!inspection) {
        throw new Error('defect service: you must supply a inspection object for saving');
      }
      delete inspection.id;
      delete inspection.updatedAt;
      delete inspection.createdAt;

      return this.httpClient.post(this._endpoint + 'inspection-dates/',
      JSON.stringify(inspection),
      {headers: {'Content-Type': 'application/json'}}).pipe(map((data) => {
        return <InspectionDates>data;
      }));
    }

    upcomingDateCheck(vehicleId:number){
      const startDate = moment().format('YYYY-MM-DD');
      const endDate = moment().add(1,'w').format('YYYY-MM-DD');

      return this.httpClient.get(this._endpoint + 'defects?filter=vehicleId||eq||'+vehicleId+'&filter=bookedFor||lte||'+endDate+'&filter=bookedFor||gte||'+startDate);
    }
}
