import { Component, OnInit, Input } from '@angular/core';
import { Container } from '../../models/container.model';
import { ContainerService } from '../../services/container.service';
import { catchError, take } from 'rxjs/operators';
import { ContainerGroup } from '../../models/container-group.model';
import { ContainerType } from '../../models/container-type.model';
import { ContainerSizeType } from '../../models/container-size-type.model';
import { IDropdownSettings } from 'ng-multiselect-dropdown';
import { Grade } from '../../models/grade.model';
import { OrderService } from 'src/app/order/services/order.service';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-container-form',
  templateUrl: './container-form.component.html',
  styleUrls: ['./container-form.component.scss']
})
export class ContainerFormComponent implements OnInit {

  groups: ContainerGroup[] = [];
  types: ContainerType[] = [];
  sizes: ContainerSizeType[] = [];
  pageRoute:string = '';

  qrSize: number = 300;

  @Input()
  container: Container = new Container();

  @Input()
  containerGrades: any = {grades: []};

  dropdownSettings = {};

  grades: Grade[] = [];

  constructor(private containerService: ContainerService) { }

  ngOnInit(): void {
    this.containerService.getAllContainerGroup()
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('container groups could not be loaded');
      return e;
    }))
    .pipe(take(1))
    .subscribe((groups: ContainerGroup[]) => {
      this.groups = groups;
    });

    this.containerService.getAllContainerTypes()
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('container typesa could not be loaded');
      return e;
    }))
    .pipe(take(1))
    .subscribe((types: ContainerType[]) => {
      this.types = types;
    });

    this.containerService.getAllContainerSizes()
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('container sizes could not be loaded');
      return e;
    }))
    .pipe(take(1))
    .subscribe((sizes: ContainerSizeType[]) => {
      this.sizes = sizes;
    });

    this.containerService.getAllGrades()
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('grades could not be loaded');
      return e;
    }))
    .pipe(take(1))
    .subscribe((grades: Grade[]) => {
      this.grades = grades;

    });

    this.pageRoute = environment.publicUrl + 'container/' + this.container.id;


    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'name',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 3,
      allowSearchFilter: true
    };
  }

  onItemSelect(item: any) {
  }
  onSelectAll(items: any) {
  }

  populateName() {
    if(this.container.containerTypeId === 9 && this.container.name === '' && environment.defaults.companyName === 'WRC') {
      let ref = 'WRC-SS-LOCK-CAB-';

      this.containerService.getCount()
      .pipe(take(1))
      .pipe(catchError((e) => {
        if(e.status === 403 || e.status === 401){return e;}
        alert('could not get count for container');
        return e;
      }))
      .subscribe((data: any) => {
        ref += data.length;
        this.container.name = ref;
      });
    }
  }

}
