import { Component, OnInit } from '@angular/core';
import { catchError, take } from 'rxjs/operators';
import { PartCategory } from 'src/app/workshop/models/part-category.model';
import { PartService } from 'src/app/workshop/services/part.service';

@Component({
  selector: 'app-part-categories',
  templateUrl: './part-categories.component.html',
  styleUrls: ['./part-categories.component.scss']
})
export class PartCategoriesComponent implements OnInit {
  categories: any = [];
  disableButtons: boolean = false
  newItem: PartCategory = new PartCategory();

  constructor(
    private partService:PartService
  ) { }

  ngOnInit(): void {
    this.loadContent();
  }

  loadContent(){
    this.newItem = new PartCategory();
    this.partService.getAllPartCategories()
    .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;}alert('Could not get categories');return e;}))
    .pipe(take(1))
    .subscribe(categories => {
      this.categories = categories;
      this.disableButtons = false;
    })
  }

  addNewRow(){
    this.disableButtons = true;
    this.newItem = new PartCategory();
  }



  save(){
    if(this.newItem.name !== ""){
      this.partService.createPartCategory(this.newItem)
      .pipe(catchError((e)=>{if(e.status === 403 || e.status === 401){return e;}alert('Could not Save Part');return e;}))
      .pipe(take(1))
      .subscribe(() => {
        this.loadContent();
      })
    } else {
      alert('Please add Category name')
    }
  }

}
