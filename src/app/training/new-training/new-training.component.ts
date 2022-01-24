import { Component, OnDestroy, OnInit } from '@angular/core';
import { Exercise } from '../exercise.model';
import { TrainingService } from '../training.service';
import { NgForm } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { UIService } from 'src/app/shared-UI/ui.service';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css'],
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  exerciseSubscription: Subscription;
  exercises: any;
  isLoadingIconNewTraining = false;

  constructor(
    private trainingService: TrainingService,
    private uiService: UIService
  ) {}

  ngOnInit(): void {
    this.uiService.loadingStateChanged.subscribe((x) => {
      this.isLoadingIconNewTraining = x;
    });

    (this.exerciseSubscription = this.trainingService.exercisesChange.subscribe(
      (exercise) => {
        this.exercises = exercise;
      }
    )),
      this.fetchExercises();
  }

  startTraining(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise);
  }

  fetchExercises() {
    this.trainingService.fetchAvailableExercises();
  }

  ngOnDestroy(): void {
    this.exerciseSubscription.unsubscribe();
  }
}
