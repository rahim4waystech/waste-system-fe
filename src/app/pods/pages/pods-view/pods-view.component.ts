import { Component, OnInit } from '@angular/core';
import { DriverJobMovement } from '../../models/driver-job-movement.model';
import { PodService } from '../../services/pod.service';
import { take, catchError } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { DriverJobStatusDetails } from '../../models/driver-job-status-details.model';
import { DriverJobStatus } from '../../models/driver-job-status.model';
import { Order } from 'src/app/order/models/order.model';
import { OrderService } from 'src/app/order/services/order.service';
import { OrderLine } from 'src/app/order/models/order-line.model';
import { Unit } from 'src/app/order/models/unit.model';
import { DocumentService } from 'src/app/core/services/document.service';
import {Document} from 'src/app/core/models/document.model';
import { environment } from 'src/environments/environment';

import * as moment from 'moment';

@Component({
  selector: 'app-pods-view',
  templateUrl: './pods-view.component.html',
  styleUrls: ['./pods-view.component.scss']
})
export class PodsViewComponent implements OnInit {

  pod: any = new DriverJobMovement();
  history: DriverJobStatusDetails[] = [];
  status: DriverJobStatus[] = [];

  order: Order = new Order();
  orderLines: OrderLine[] = [];
  units: Unit[] = [];
  images: any[] = [];
  documents: Document[] = [];
  constructor(private podService: PodService,
    private san: DomSanitizer,
    private documentService: DocumentService,
    private orderService: OrderService,
    private route: ActivatedRoute) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.loadPOD(+params['id']);
    })

    this.podService.getAllStatuses()
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('could not load job status')
      return e;
    }))
    .subscribe((status: any) => {

      this.status = status;
    })

    this.orderService.getAllUnits()
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('could not load units');
      return e;
    }))
    .subscribe((units: Unit[]) => {
      this.units = units;
    })
  }

  podimage: any;
  loadPOD(id: number) {
    this.podService.getPODById(id)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('could not load POD');
      return e;
    }))
    .subscribe((pod: any) => {
      this.pod = pod;
      this.podimage = pod.signature;

      this.loadHistory();
      this.loadOrder();
      this.loadDocuments();
    })

  }

  loadDocuments() {
    this.documentService.getDocumentsByEntityAndEntityId('driver-job-movement', this.pod.id)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not load documents');
      return e;
    }))
    .subscribe((documents: Document[]) => {
      this.documents = documents;

      this.documents.forEach((document) => {
        this.loadImage(document.id);
      })
    })
  }

  loadImage(docId: number) {
      this.documentService.getImageById(docId)
      .pipe(take(1))
      .pipe(catchError((e) => {
        return e;
      }))
      .subscribe((image: any) => {
        this.images.push(image);
      })
  }
  loadHistory() {

    this.podService.getAllStatusHistoryForPOD(this.pod.jobId)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('could not history for job');
      return e;
    }))
    .subscribe((data: any) => {
      this.podService.getPodsByJobId(this.pod.jobId)
      .pipe(take(1))
      .subscribe((pods: DriverJobMovement[]) => {
               
        let history = this.groupJobMovementHistory(data)[this.findPositionInMovements(pods, this.pod.id)];
        
        if(!history) {
          history = [];
        }

        this.history = history;
      });
    })
  }

  findPositionInMovements(movements: DriverJobMovement[], podId: number=-1): number {
    let index = 0;

    movements.forEach((movement, mindex) => {
      if(movement.id === podId) {
        index = mindex;
      }
    });

    return index;

  }

  groupJobMovementHistory(history: DriverJobStatusDetails[]=[]) {
    let groupedHistory = [];

    let head = 0;
    let previousIndex = -1;

    history.forEach((item) => {
      if(previousIndex > item.driverJobStatusId) {
        head++;
      }

      if(groupedHistory[head] === undefined) {
        groupedHistory[head] = [];
      }

      groupedHistory[head].push(item);
      previousIndex = item.driverJobStatusId;

    });

    return groupedHistory;
  }

  loadOrder() {
    this.orderService.getOrderByIdForPOD(this.pod.job.orderId)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('could not load order');
      return e;
    }))
    .subscribe((order: Order) => {
      this.order = order;
      this.loadOrderLines();
    })
  }

  loadOrderLines() {
    this.orderService.getOrderLinesByOrderIdForPod(this.order.id)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('could not load order lines');
      return e;
    }))
    .subscribe((orderlines: OrderLine[]) => {
      this.orderLines = orderlines;
    })
  }

  getSiteAddress() {
    let address = "";

    if(this.order.site.shippingAddress1 !== "") {
      address += this.order.site.shippingAddress1 + "<br />";
    }  
    
    if(this.order.site.shippingAddress2 !== "") {
      address += this.order.site.shippingAddress2 + "<br />";
    }

    if(this.order.site.shippingCity !== "") {
      address += this.order.site.shippingCity + "<br />";
    } 
    
    if(this.order.site.shippingCountry !== "") {
      address += this.order.site.shippingCountry + "<br />";
    } 
    
    if(this.order.site.shippingPostCode !== "") {
      address += this.order.site.shippingPostCode + "<br />";
    }


    return address;
  }

  getCompanyAddress() {
    let address = "";

    if(environment.invoicing.address1 !== "") {
      address += environment.invoicing.address1 + "<br />";
    }

    if(environment.invoicing.address2 !== "") {
      address += environment.invoicing.address2 + "<br />";
    }

    if(environment.invoicing.addressCity !== "") {
      address += environment.invoicing.addressCountry + "<br />";
    }

    if(environment.invoicing.addressCountry !== "") {
      address += environment.invoicing.addressCountry + "<br />";
    }

    if(environment.invoicing.addressPostcode !== "") {
      address += environment.invoicing.addressPostcode + "<br />";
    }

    return address;
  }

  getSignature() {
    return this.pod.signature;
  }

  getMapUrl(status: DriverJobStatusDetails) {
    return this.san.bypassSecurityTrustUrl("https://google.com/maps?q=" + status.gpsLat + ',' + status.gpsLong);
  }

  getStatusFromId(statusId: number) {
    return !this.status.filter(s => s.id === statusId)[0] ? {name: 'N/A'} : this.status.filter(s => s.id === statusId)[0];
  }

  getService() {
    const serviceType = '';

    let service = this.orderLines.filter(ol => ol.isPrimaryCharge)[0];

    if(!service) {
      service = this.orderLines[0];
    }

    return service.quoteLine ? service.quoteLine?.product.name : service.name;
  }

  getUnit() {
    const serviceType = '';

    let service = this.orderLines.filter(ol => ol.isPrimaryCharge)[0];

    if(!service) {
      service = this.orderLines[0];
    }

    const unit = this.units.filter(u => u.id === service.quoteLine?.product.unitId)[0];

    if(unit) {
      return unit.name;
    } else {
      // must be quick item
      const unitpl = this.units.filter(u => u.id === service.unitId)[0];
      return unitpl.name;
    }
  }

  createPDFFile() {
    this.podService.getSinglePDF(this.pod.id, {
      order: this.order,
      pod: this.pod,
      companyName: environment.invoicing.companyName,
      addressInfo: this.getCompanyAddress(),
      companyLogo: environment.invoicing.companyLogo, 
      service: this.getService(),
      serviceUnit: this.getUnit(),
      serviceAmount: this.pod.qty,
      siteAddress: this.getSiteAddress(),
      signatureDetails: this.getSignatureDetails(),
      gpsCordsForSignature: this.history.filter(h => h.driverJobStatusId === 4)[0], 
      images: this.images,
    })
    .pipe(take(1))
    .pipe(catchError((e)=> {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not generate pdf please try again later.');
      return e;
    }))
    .subscribe((data:any) => {
      window.open(environment.publicUrl + data.fileName, '_blank');
    })
  }

  getSignatureDetails() {
    const result = this.history.filter(h => h.driverJobStatusId === 4)[0];
    
    if(!result) {
      return "Signature time was not captured"
    } else {
      return "Signature Signed at " + moment("10/05/1991 " + result.time).format('HH:mm:ss') + " on " + moment(result.date).format('DD/MM/YYYY');
    }
  }

  save() {
    this.podService.updatePOD(this.pod)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('could not update pod');
      return e;
    }))
    .subscribe(() => {
      window.location.href = '/pods';
    })
  }
}
