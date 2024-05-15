import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { Container } from '../models/container.model';
import { ContainerType } from '../models/container-type.model';
import { ContainerGroup } from '../models/container-group.model';
import { ContainerSizeType } from '../models/container-size-type.model';
import { Grade } from '../models/grade.model';
import { Job } from 'src/app/timeline-skip/models/job.model';
import { ContainerGrades } from '../models/container-grades.model';

@Injectable({
  providedIn: 'root'
})
export class ContainerService {


  /**
  * Endpoint for http calls
  */
  private _endpoint: string = environment.api.endpoint;


  constructor(private httpClient: HttpClient) { }


  /**
   * Get a container from the backend by id
   *
   * @param id number id of container to get
   *
   * @returns Observable<Container>
   */
  getContainerById(id: number): Observable<Container> {

    if (id <= 0 || id === null || id === undefined) {
      throw new Error('ContainerService: Id must be a valid number');
    }

    return this.httpClient.get(this._endpoint + 'container/' + id).pipe(map((value: any) => {
      return <Container>value;
    }));
  }


  /**
   * creates a container in the backend based on container object.
   * @param Container container object.
   *
   * @returns Observable<Container>
   */
  createContainer(container: Container): Observable<Container> {


    if (!container) {
      throw new Error('container service: you must supply a container object for saving');
    }

    delete container.createdAt;
    delete container.updatedAt;

    if (container.id > 0) {
      throw new Error('container service: Cannot create a existing object');
    }

    delete container.id;
    return this.httpClient.post(this._endpoint + 'container',
      JSON.stringify(container),
      { headers: { 'Content-Type': 'application/json' } }).pipe(map((data) => {
        return <Container>data;
      }));
  }


  /**
   * updates a container in the backend based on container object.
   * @param container container object.
   *
   * @returns Observable<Container>
   */
  updateContainer(container: Container): Observable<Container> {


    if (!container) {
      throw new Error('container service: you must supply a container object for saving');
    }

    delete container.createdAt;
    delete container.updatedAt;

    if (!container.id || container.id === -1) {
      throw new Error('container service: Cannot update an record without id');
    }

    return this.httpClient.put(this._endpoint + 'container/' + container.id,
      JSON.stringify(container),
      { headers: { 'Content-Type': 'application/json' } }).pipe(map((data) => {
        return <Container>data;
      }));
  }

  getAllContainerTypes(): Observable<ContainerType[]> {
    return this.httpClient.get(this._endpoint + 'container-type').pipe(map((data) => {
      return <ContainerType[]>data;
    }));
  }

  getAllContainerGroup(): Observable<ContainerGroup[]> {
    return this.httpClient.get(this._endpoint + 'container-group').pipe(map((data) => {
      return <ContainerGroup[]>data;
    }));
  }

  getAllContainerSizes(): Observable<ContainerSizeType[]> {
    return this.httpClient.get(this._endpoint + 'container-size-type').pipe(map((data) => {
      return <ContainerSizeType[]>data;
    }));
  }

  getAllGrades(): Observable<Grade[]> {
    return this.httpClient.get(this._endpoint + 'grade').pipe(map((data) => {
      return <Grade[]>data;
    }));
  }

  getCount(): Observable<Container[]> {
    return this.httpClient.get(this._endpoint + 'container?fields=id').pipe(map((data) => {
      return <Container[]>data;
    }));
  }


  getAllContainers(): Observable<Container[]> {
    return this.httpClient.get(this._endpoint + 'container').pipe(map((data) => {
      return <Container[]>data;
    }));
  }

  getContainerForSiteId(siteId: number): Observable<Container> {
    if (!siteId) {
      throw new Error('Site id must be supplied in getContainerForSiteId');
    }

    return this.httpClient.get(this._endpoint + 'container?filter=containerLocationId||eq||' + siteId).pipe(map((data) => {
      return <Container>data;
    }))
  }

  setTracking(job: Job): Observable<Job> {


    if (!job) {
      throw new Error('container service: you must supply a job object for use');
    }

    delete job.createdAt;
    delete job.updatedAt;

    if (job.id <= 0) {
      throw new Error('container service: must be a existing object');
    }

    delete job.id;
    return this.httpClient.post(this._endpoint + 'container/setTracking',
      JSON.stringify(job),
      { headers: { 'Content-Type': 'application/json' } }).pipe(map((data) => {
        return <Job>data;
      }));
  }

  pdf(data: any) {
    return this.httpClient.post(this._endpoint + 'container/pdf',JSON.stringify(data),
    {headers: {'Content-Type': 'application/json'}});

  }

  bulkAddContainerGrades(grades: ContainerGrades[]) {
    if(!grades) {
      throw new Error('You must supply grades on bulkAddContainerGrades');
    }

    grades.forEach((element: ContainerGrades) => {
      delete element.id;
      delete element.createdAt;
      delete element.updatedAt;
    });

    return this.httpClient.post(this._endpoint + 'container-grades/bulk',
    JSON.stringify({bulk: grades}),
    { headers: { 'Content-Type': 'application/json' } }).pipe(map((data) => {
      return <ContainerGrades[]>data;
    }));
  }

  getAllGradesForContainer(containerId: number) {
    if(!containerId || containerId === -1) {
      throw new Error('You must supply a valid id in getAllGradesForContainer');
    }

    return this.httpClient.get(this._endpoint + 'container-grades?filter=containerId||eq||' + containerId + '&join=grade').pipe(map((data) => {
      return <ContainerGrades[]>data;
    }));
  }

  deleteAllGradesForContainer(containerId: number) {
    if(!containerId || containerId === -1) {
      throw new Error('You must supply a valid id in deleteAllGradesForContainer');
    }

    return this.httpClient.delete(this._endpoint + 'container-grades/deleteByContainer/' + containerId);

  }

}
