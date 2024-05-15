import { Component, OnInit } from '@angular/core';
import { Container } from '../../models/container.model';
import { ActivatedRoute } from '@angular/router';
import { ContainerValidatorService } from '../../validators/container-validator.service';
import { ContainerService } from '../../services/container.service';
import { take, catchError } from 'rxjs/operators';
import { ContainerGrades } from '../../models/container-grades.model';
import { Grade } from '../../models/grade.model';
@Component({
  selector: 'app-containers-edit',
  templateUrl: './containers-edit.component.html',
  styleUrls: ['./containers-edit.component.scss']
})
export class ContainersEditComponent implements OnInit {


  container: Container = new Container();


  containerGrades: any = {grades: []};

  isError: boolean = false;
  isServerError: boolean = false;
  isSuccess: boolean = false;

  constructor(private route: ActivatedRoute,
    private containerValidator: ContainerValidatorService,
    private containerService: ContainerService) { }

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.loadContainer(+params['id']);
    })
  }

  loadContainer(id: number): void {
    this.containerService.getContainerById(id)
    .pipe(take(1))
    .pipe(catchError((e) => {
      this.isServerError = true;
      return e;
    }))
    .subscribe((container: Container) => {
      this.container = container;

      this.loadGradesForContainer();
    })
  }

  loadGradesForContainer() {
    this.containerService.getAllGradesForContainer(this.container.id)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('could not load grades for container');
      return e;
    }))
    .subscribe((containerGrades: ContainerGrades[]) => {
      const grades = [];

      containerGrades.forEach((element: any) => {
        grades.push(element.grade);
      })

      this.containerGrades.grades = grades;
    })
  }

  onSubmit() {

    this.isError = false;
    this.isServerError = false;

    if(this.containerValidator.isValid(this.container)) {
      // try to save it
      this.containerService.updateContainer(this.container)
      .pipe(take(1))
      .pipe(catchError((e) => {
        this.isServerError = true;
        return e;
      }))
      .subscribe(() => {
        if(this.containerGrades.grades.length > 0) {
          this.deleteAllGrades();
        } else {
          // move to edit mode
          window.location.href = '/containers';
        }
      })
    } else {
      this.isError = true;
    }
  }

  deleteAllGrades() {
    this.containerService.deleteAllGradesForContainer(this.container.id)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not delete existing grades');
      return e;
    }))
    .subscribe(() => {
      this.saveGrades(this.container.id);
    })
  }

  saveGrades(containerId: number) {
    const containerGrades: ContainerGrades[] = [];

    this.containerGrades.grades.forEach((grade: Grade) => {
      const containerGrade = new ContainerGrades();
      containerGrade.gradeId = grade.id;
      containerGrade.containerId = containerId;

      containerGrades.push(containerGrade);
    });

    this.containerService.bulkAddContainerGrades(containerGrades)
    .pipe(take(1))
    .pipe(catchError((e) => {
      if(e.status === 403 || e.status === 401) {
        return e;
      }
      alert('Could not save grades for container');
      return e;
    }))
    .subscribe(() => {
      // move to edit mode
      window.location.href = '/containers';
    })
  }



}
