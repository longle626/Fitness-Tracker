import { Component, OnInit } from '@angular/core';
import { Exercise } from '../exercise.model';
import { TrainingService } from '../training.service';
import { NgForm } from '@angular/forms';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css'],
})
export class NewTrainingComponent implements OnInit {
  constructor(
    private trainingService: TrainingService,
    private db: AngularFirestore
  ) {}

  exercises: Observable<any>;

  ngOnInit(): void {
    this.exercises = this.db.collection('availableExercise').valueChanges();
  }

  startTraining(form: NgForm) {
    this.trainingService.startExercise(form.value.exercise);
  }
}
