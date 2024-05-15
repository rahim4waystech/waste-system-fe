import { Component, OnInit } from '@angular/core';
import { take } from 'rxjs/operators';
import { catchError } from 'rxjs/operators';
import { Grade } from 'src/app/container/models/grade.model';
import { ModalService } from 'src/app/core/services/modal.service';
import { OrderStateService } from '../../services/order-state.service';
import { OrderService } from '../../services/order.service';

@Component({
  selector: 'app-order-add-grade',
  templateUrl: './order-add-grade.component.html',
  styleUrls: ['./order-add-grade.component.scss']
})
export class OrderAddGradeComponent implements OnInit {

  isError: boolean = false;
  isServerError: boolean = false;

  grade: Grade = new Grade();

  constructor(private orderService: OrderService,
              private modalService: ModalService,
              private orderStateService: OrderStateService) { }

  ngOnInit(): void {
  }

  onSubmit() {
    this.isServerError = false;
    this.isError = false;

    if(this.grade.name === '' || !this.grade.name) {
      this.isError = true;
      return;
    }

    this.orderService.createGrade(this.grade)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not save grade');
      return e;
    }))
    .subscribe((grade: Grade) => {
      // pass grade in state back to the order form
      this.orderStateService.gradeAdded$.next(JSON.parse(JSON.stringify(grade)));
      this.cancel();
    })

  }

  cancel() {
    this.grade = new Grade();
    this.modalService.close('orderAddGradeModal');
  }

}
