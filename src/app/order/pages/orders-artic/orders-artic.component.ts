import { Component, OnInit, ViewChild } from '@angular/core';
import * as moment from 'moment';
import { take, catchError } from 'rxjs/operators';
import { AccountService } from 'src/app/account/services/account.service';
import { AuthService } from 'src/app/auth/services/auth.service';
import { GridButton } from 'src/app/core/models/grid-button.model';
import { GridColumn } from 'src/app/core/models/grid-column.model';
import { GridFilter } from 'src/app/core/models/grid-filter.model';
import { GridSearchFilter } from 'src/app/core/models/grid-search-filter.model';
import { GridSelectedFilter } from 'src/app/core/models/grid-selected-filter.model';
import { ModalService } from 'src/app/core/services/modal.service';
import { GridComponent } from 'src/app/core/widgets/grid/grid.component';
import { UserSkill } from 'src/app/settings/models/user-skill.model';
import { UserService } from 'src/app/user/services/user.service';
import { Account } from '../../models/account.model';
import { OrderStatus } from '../../models/order-status.model';
import { OrderType } from '../../models/order-type.model';
import { Order } from '../../models/order.model';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-orders-artic',
  templateUrl: './orders-artic.component.html',
  styleUrls: ['./orders-artic.component.scss']
})
export class OrdersArticComponent implements OnInit {
  skills: UserSkill[] = [];

  types: OrderType[] = [];
  orderStatusCurrent = '';
  orderTypeId: number = -1;
  searchFilters: any = {};

  accounts: Account[] = [];
  tips: Account[] = [];
  statuses: OrderStatus[] = [];
  selectedOrders: Order[] = [];

  @ViewChild(GridComponent, { static: false}) gridComponent: GridComponent;



  buttons: GridButton[] = [
    {label: '<i class="fas fa-pencil-alt"></i>', link: '/orders/edit/:id', type: 'btn-warning',} as GridButton,
    {label: '<i class="fas fa-check-circle"></i>', link: '/orders/accept/:id', type: 'btn-success', trigger: (record) => record.orderStatus.name !== 'Accepted'} as GridButton,
    {label: '<i class="fas fa-times-circle"></i>', link: '/orders/decline/:id', type: 'btn-danger',trigger: (record) => record.orderStatus.name !== 'Accepted' && record.orderStatusId !== 4} as GridButton,
    {label: '<i class="fas fa-copy"></i>', link: '/orders/copy/:id', type: 'btn-info'} as GridButton,
    {label: '<i class="far fa-calendar-times"></i>', link: '/orders/complete/:id', type: 'btn-primary', trigger: (record) => record.orderTypeId !== 1 && record.orderStatusId !== 4} as GridButton,

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
    // {active: true, label: 'Po Number', field: 'poNumber'} as GridColumn,
    {active: true, label: 'Created At', field: 'createdAt', value: v => moment(v).format('DD/MM/YYYY HH:mm:ss')} as GridColumn,
    {active: true, label: 'Updated At', field: 'updatedAt', value: v => moment(v).format('DD/MM/YYYY HH:mm:ss')} as GridColumn
  ];

  // Org filter handled at API level
  filters: GridFilter[] = [
    {
      condition: 'eq',
      field: 'orderTypeId',
      value: 4,
    } as GridFilter
  ]

  searchFields: any = ['id','account.name','site.name','date','time','description','orderStatus.name','poNumber','orderType.name', 'tipSite.name'];

  searchFiltersGrid: GridSearchFilter[] = [
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
    {
      field: 'tipSite.name',
      label: 'Tip Site',
    } as GridSearchFilter,
  ]

  relationships: string[] = ['tipSite'];

  constructor(private userService: UserService,
    private modalService: ModalService,
    private accountService: AccountService,
    private orderService: OrderService,
    private authService: AuthService) { }

  ngOnInit(): void {
    this.loadTypes();

    this.accountService.getAllCustomers()
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401){return e;}
      alert('Could not load customers');
      return e;
    }))
    .subscribe((accounts: Account[]) => {
      this.accounts = accounts.filter(a => a.isactive);
    });

    this.accountService.getAllTips()
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401){return e;}
      alert('Could not load tips');
      return e;
    }))
    .subscribe((accounts: Account[]) => {
      this.tips = accounts;
    });

    this.orderService.getAllStatuses()
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401){return e;}
      alert('Could not load status');
      return e;
    }))
    .subscribe((statuses: OrderStatus[]) => {
      this.statuses = statuses;
    });
   }


  setSearchFieldOnGrid(fieldName, value, operator='eq') {

    const filters = this.gridComponent.filters;
    this.gridComponent.filters = this.gridComponent.filters.filter(f => f.field !== fieldName);
    if(value && value !== '') {
      this.gridComponent.filters.push({
        condition: operator,
        value: value,
        field: fieldName,
      })
    }
  }

   search() {
    this.setSearchFieldOnGrid('account.name', this.searchFilters['customer'], 'cont');
    this.setSearchFieldOnGrid('tipSite.name', this.searchFilters['tipSite'], 'cont');
    this.setSearchFieldOnGrid('date', this.searchFilters['date']);
    this.setSearchFieldOnGrid('poNumber', this.searchFilters['poNumber'], 'cont');
    this.setSearchFieldOnGrid('orderStatusId', this.searchFilters['status']);
    this.setSearchFieldOnGrid('id', this.searchFilters['orderId']);


    this.gridComponent.getRecordsForEntity();
    this.gridComponent.onPaginationPageClicked(1);
   }

   clear() {
    this.searchFilters = {};
    this.gridComponent.search = '';
    this.search();
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

   simpleOrder() {
    window.location.href = '/simple/order';
   }
   loadTypes() {
    this.orderService.getAllOrderTypes()
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
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

  onCheckboxSelected($event) {
    if($event.checked) {
      this.selectedOrders.push(JSON.parse(JSON.stringify($event.record)));
    } else {
      this.selectedOrders = this.selectedOrders.filter(j => j.id !== $event.record.id);
    }
   }

   openModal(modalName: string) {
     this.modalService.open(modalName);
   }

   assignLoads() {
     if(this.selectedOrders.length === 0) {
       alert('You must select at least one order');
       return;
     }

     this.modalService.open("orderArticAssignLoads");
   }
}
