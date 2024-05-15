import { Component, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { take, catchError } from 'rxjs/operators';
import { AuthService } from 'src/app/auth/services/auth.service';
import { GridButton } from 'src/app/core/models/grid-button.model';
import { GridColumn } from 'src/app/core/models/grid-column.model';
import { GridFilter } from 'src/app/core/models/grid-filter.model';
import { GridSearchFilter } from 'src/app/core/models/grid-search-filter.model';
import { GridSelectedFilter } from 'src/app/core/models/grid-selected-filter.model';
import { ModalService } from 'src/app/core/services/modal.service';
import { GridComponent } from 'src/app/core/widgets/grid/grid.component';
import { OrderType } from 'src/app/order/models/order-type.model';
import { OrderService } from 'src/app/order/services/order.service';
import { UserSkill } from 'src/app/settings/models/user-skill.model';
import { UserService } from 'src/app/user/services/user.service';

@Component({
  selector: 'app-artic-timeline-transport-all-orders',
  templateUrl: './artic-timeline-transport-all-orders.component.html',
  styleUrls: ['./artic-timeline-transport-all-orders.component.scss']
})
export class ArticTimelineTransportAllOrdersComponent implements OnInit {

  skills: UserSkill[] = [];

  types: OrderType[] = [];
  orderStatusCurrent = '';
  orderTypeId: number = -1;

  @ViewChild(GridComponent, { static: false}) gridComponent: GridComponent;



  buttons: GridButton[] = [
    {label: '<i class="fas fa-pencil-alt"></i>', link: '/orders/edit/:id', type: 'btn-warning',} as GridButton,
    {label: '<i class="fas fa-check-circle"></i>', link: '/orders/accept/:id', type: 'btn-success', trigger: (record) => record.orderStatus.name !== 'Accepted'} as GridButton,
    {label: '<i class="fas fa-times-circle"></i>', link: '/orders/decline/:id', type: 'btn-danger',trigger: (record) => record.orderStatus.name !== 'Accepted'} as GridButton,
    {label: '<i class="fas fa-copy"></i>', link: '/orders/copy/:id', type: 'btn-info'} as GridButton,
  ]
  columns: GridColumn[] = [
    {active: true, label: '#', field: 'id'} as GridColumn,
    {active: true, label: 'Account', field: 'account.name'} as GridColumn,
    {active: true, label: 'Site', field: 'site.name'} as GridColumn,
    {active: true, label: 'Tip Site', field: 'tipSite.name', value: (v, r) => !r.tipSite ? 'N/A' : r.tipSite.name} as GridColumn,
    {active: true, label: 'Date', field: 'date', value: v => moment(v).format('DD/MM/YYYY')} as GridColumn,
    {active: true, label: 'Time', field: 'time'} as GridColumn,
    {active: true, label: 'Description', field: 'description', value: (v: string) => v.substr(0, 120) + '...'} as GridColumn,
    {active: true, label: 'Status', field: 'orderStatus.name'} as GridColumn,
    {active: true, label: 'Type', field: 'orderType.name'} as GridColumn,
    // {active: true, label: 'Po Number', field: 'poNumber'} as GridColumn,
    {active: true, label: 'Created At', field: 'createdAt', value: v => moment(v).format('DD/MM/YYYY HH:mm:ss')} as GridColumn,
    {active: true, label: 'Updated At', field: 'updatedAt', value: v => moment(v).format('DD/MM/YYYY HH:mm:ss')} as GridColumn
  ];

  // Org filter handled at API level
  filters: GridFilter[] = []

  searchFields: any = ['id','account.name','site.name','date','time','description','orderStatus.name','poNumber','orderType.name'];

  searchFilters: GridSearchFilter[] = [
    {
      field: 'id',
      label: 'Order ID',
    } as GridSearchFilter,
    {
      field: 'account.name',
      label: 'Account',
    } as GridSearchFilter,
    {
      field: 'site.name',
      label: 'Site',
    } as GridSearchFilter,
    {
      field: 'date',
      label: 'Date',
      type: 'date',
    } as GridSearchFilter,
    {
      field: 'time',
      label: 'Time',
    } as GridSearchFilter,
    {
      field: 'description',
      label: 'Description',
    } as GridSearchFilter,
    {
      field: 'orderStatus.name',
      label: 'Order Status',
    } as GridSearchFilter,
    {
      field: 'poNumber',
      label: 'Purchase Order Number',
    } as GridSearchFilter,
    {
      field: 'orderType.name',
      label: 'Order Type',
    } as GridSearchFilter,
  ]

  constructor(private userService: UserService,
    private modalService: ModalService,
    private orderService: OrderService,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.loadTypes();
   }

   changeVehicleType($event) {
     this.gridComponent.filters = this.gridComponent.filters.filter(f => f.field !== 'orderTypeId');

     this.orderTypeId = +$event.target.value;

     if(this.orderTypeId === -1) {
       return;
     }

     this.gridComponent.filters.push({
      condition: 'eq',
      value: +$event.target.value,
      field: 'orderTypeId',
     } as GridFilter)
     this.gridComponent.getRecordsForEntity();
   }

   loadSkills() {
         this.userService.getAllSkillsForUser(this.authService.getUser().id)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('could not load skills for user');
      return e;
    }))
    .subscribe((skills: any) => {
      this.skills = skills;

      this.skills.forEach((skill: UserSkill) => {
        skill.orderType = this.types.filter(t => t.id === skill.orderTypeId)[0];
      })

      const primary = this.skills.filter(s => s.isPrimary)[0];

      if(primary) {
        this.changeVehicleType({target: {value: primary.orderTypeId}});
      }

      // If no skills setup add all
      if(skills.length === 0) {
        this.types.forEach((type) => {
          this.skills.push({
            userId: -1,
            orderTypeId: type.id,
            orderType: type,
            id: -1,
          } as UserSkill)
        })
      }
    });
   }

   loadTypes() {
    this.orderService.getAllOrderTypes()
    .pipe(take(1))
    .pipe(catchError((e) => {
      alert('could not load order types');
      return e;
    }))
    .subscribe((types: any) => {
      this.types = types;
      this.loadSkills();
    });
   }

  ngAfterViewInit() {
      // check on startup for filter for restoring filter on grid from local storage
      this.gridComponent.selectedFilters.forEach((filter) => {
        if(filter.condition === 'eq' && filter.field === 'orderStatus.name') {
          this.orderStatusCurrent = filter.value;
        }
      })

      this.gridComponent.sortColumn = 'id';
      this.gridComponent.sortDirection = 'desc';
  }

  setOrderStatus(status: string) {
    this.orderStatusCurrent = status;

    if(this.orderStatusCurrent !== '') {
      this.gridComponent.selectedFilters = [
        {
          condition: 'eq',
          field: 'orderStatus.name',
          value: this.orderStatusCurrent,
        }  as GridSelectedFilter
      ]
      this.gridComponent.getRecordsForEntity();
      this.gridComponent.onValueChanged();
    } else {
      this.gridComponent.selectedFilters = [];
      this.gridComponent.getRecordsForEntity();
      this.gridComponent.onValueChanged();
    }
  }

  cancel() {
    this.modalService.close('ArtictransportAllOrdersModal');
  }


}
