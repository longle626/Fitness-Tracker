import { Component, OnDestroy, OnInit } from '@angular/core';
import { Exercise } from '../exercise.model';
import { TrainingService } from '../training.service';
import { NgForm } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css'],
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  constructor(private trainingService: TrainingService) {}
  exerciseSubscription: Subscription;
  exercises: any;

  ngOnInit(): void {
    this.exerciseSubscription = this.trainingService.exercisesChange.subscribe(
      (exercise) => {
        this.exercises = exercise;
      }
    );
    this.trainingService.fetchAvailableExercises();
  }

  startTraining(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise);
  }

  ngOnDestroy(): void {
    this.exerciseSubscription.unsubscribe();
  }
}
