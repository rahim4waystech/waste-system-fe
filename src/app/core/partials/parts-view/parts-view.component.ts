import { Component, Input, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { catchError, take } from 'rxjs/operators';
import { GridButton } from 'src/app/core/models/grid-button.model';
import { GridColumn } from 'src/app/core/models/grid-column.model';
import { GridFilter } from 'src/app/core/models/grid-filter.model';
import { GridSearchFilter } from 'src/app/core/models/grid-search-filter.model';
import { GridComponent } from 'src/app/core/widgets/grid/grid.component';
import { Part } from 'src/app/workshop/models/part.model';
import { PartService } from 'src/app/workshop/services/part.service';
import { PartAssignment } from '../../models/part-assignment.model';

@Component({
  selector: 'app-parts-view',
  templateUrl: './parts-view.component.html',
  styleUrls: ['./parts-view.component.scss']
})
export class PartsViewComponent implements OnInit {

  @Input()
  defectId: number = -1;

  @Input()
  vehicleId: number = -1;

  @Input()
  allowLink:boolean = false;

  parts:any = [];
  total: number = 0;

  // Stuff for select dropdown

  dropdownSettings: any = {};
  partList:any = [];
  selectedParts: any = [];
  addParts: any = [];
  showDropdown:boolean = true;
  showSuccess:boolean = false;

  constructor(
    private partService:PartService
  ) { }

  ngOnInit(): void {
    this.partService.getAllPartsInStock()
    .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;}alert('Could not get Assigned Parts');return e;}))
    .pipe(take(1))
    .subscribe((parts:any) => {
      this.partList = parts;

      this.partList.forEach(item => {
        item.display = item.name + '(' + item.manufacturer + ' ' + item.model + ' - P/N: ' + item.manufacturerPartNumber + '): £' + item.value + ' (' + item.qty +' In Stock)';
      })
    })

    this.dropdownSettings = {
      singleSelection: false,
      idField: 'id',
      textField: 'display',
      selectAllText: 'Select All',
      unSelectAllText: 'UnSelect All',
      itemsShowLimit: 20,
      allowSearchFilter: true
    };
  }

  ngOnChanges(changes: SimpleChanges) {
    if(changes.defectId !== undefined || changes.vehicleId !== undefined) {
      if(changes.defectId.currentValue !== -1 && changes.defectId.currentValue !== null) {
        this.loadAssignments();
      } else if(changes.vehicleId.currentValue !== -1 && changes.vehicleId.currentValue !== null) {
        this.loadAssignments();
      }
    }
  }

  loadAssignments(){
    this.parts = [];
    if(this.defectId === -1){
      this.partService.getAssignmentsByVehicleId(this.vehicleId)
      .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;}alert('Could not get Assigned Parts');return e;}))
      .pipe(take(1))
      .subscribe((data:any) => {
        data.forEach(item => {
          this.total += item.qty * item.part.value;
        })

        this.parts = data;
      })
    } else {
      this.partService.getAssignmentsByDefectId(this.defectId)
      .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;}alert('Could not get Assigned Parts');return e;}))
      .pipe(take(1))
      .subscribe((data:any) => {
        this.total = 0;
        data.forEach(item => {
          this.total += item.qty * item.part.value;
        })

        this.parts = data;
      })
    }

  }

  onItemSelect(item: any) {

  }

  onSelectAll(items: any) {
  }

  populateList(){
    this.selectedParts.forEach(item => {
      this.addParts.push(this.partList.filter(f=>f.id === item.id)[0]);
    })

    this.addParts.forEach(part => {
      part.addQty = 0;
      part.totalStock = this.partList.filter(f=>f.id === part.id)[0].qty;
    })

    this.showDropdown = false;
    this.selectedParts = [];
  }

  updateParts(){
    if(this.validate()){
      this.addParts.forEach(part => {
        // add part to part-assignment
        let partObj = new PartAssignment();

        partObj.defectId = this.defectId;
        partObj.vehicleId = this.vehicleId;
        partObj.partId = part.id;
        partObj.part = {id:part.id} as any;
        partObj.qty = part.addQty;

        this.partService.assignPart(partObj)
        .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;}alert('Could not Save Assignment');return e;}))
        .pipe(take(1))
        .subscribe(() => {
          // Now update Part Availability Qty
          this.partService.getPartById(part.id)
          .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;}alert('Could not get Part');return e;}))
          .pipe(take(1))
          .subscribe((partInfo:Part) => {
            let updatePart = partInfo[0];
            updatePart.qty = updatePart.qty - part.addQty;
            this.partService.updatePart(updatePart)
            .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;}alert('Could not get Part');return e;}))
            .pipe(take(1))
            .subscribe(() => {})
          })
        })
      })
      this.addParts = [];
      this.showDropdown = true;
      this.showSuccess = true;
      this.parts = [];
      this.loadAssignments();

    } else {
      alert('Please check Quantities for Overallocated or Underallocated Parts')
    }
  }

  validate(){
    let result = true;

    this.addParts.forEach(part => {
      if(part.addQty <= 0 || part.addQty > part.totalStock){
        result = false;
      }
    })

    return result;
  }

}
