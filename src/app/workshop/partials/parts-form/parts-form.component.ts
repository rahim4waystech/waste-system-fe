import { Component, Input, OnInit } from '@angular/core';
import { catchError, take } from 'rxjs/operators';
import { AccountService } from 'src/app/account/services/account.service';
import { Account } from 'src/app/order/models/account.model';
import { PartCategory } from '../../models/part-category.model';
import { Part } from '../../models/part.model';
import { PartService } from '../../services/part.service';

@Component({
  selector: 'app-parts-form',
  templateUrl: './parts-form.component.html',
  styleUrls: ['./parts-form.component.scss']
})
export class PartsFormComponent implements OnInit {
  @Input()
  part: Part = new Part();

  depots: any = [];
  partCat: any = [];

  constructor(
    private accountService:AccountService,
    private partService:PartService
  ) { }

  ngOnInit(): void {
    this.accountService.getAllDepots()
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('depots could not be loaded');
      return e;
    }))
    .pipe(take(1))
    .subscribe((depots: Account[]) => {
      this.depots = depots;
    });

    this.partService.getAllPartCategories()
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {return e;}alert('depots could not be loaded');return e;
    }))
    .pipe(take(1))
    .subscribe((categories: PartCategory[]) => {
      this.partCat = categories;
    });
  }

  changeDepot(event){
    this.part.depotId = parseInt(event.target.value,10);
    this.part.depot = {id:parseInt(event.target.value,10)} as any;
  }

  changeCat(event){
    this.part.partCategoryId = parseInt(event.target.value,10);
    this.part.partCategory = {id:parseInt(event.target.value,10)} as any;
  }

}
