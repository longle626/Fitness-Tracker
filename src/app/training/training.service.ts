import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, Subject } from 'rxjs';
import { Exercise } from './exercise.model';

@Injectable()
export class TrainingService {
  exerciseChange = new Subject();
  exercisesChange = new Subject();
  private availableExercise: Exercise[] = [];
  private runningExercise?: Exercise;
  private exercises?: Exercise[] = [];

  constructor(public db: AngularFirestore) {}
  fetchAvailableExercises() {
    this.db
      .collection('availableExercise')
      .snapshotChanges()
      .pipe(
        map((docArray) => {
          return docArray.map((doc) => {
            return {
              id: doc.payload.doc['id'],
              name: doc.payload.doc.data()['name'],
              duration: doc.payload.doc.data()['duration'],
              calories: doc.payload.doc.data()['calories'],
            };
          });
        })
      )
      .subscribe((exercies: Exercise[]) => {
        this.availableExercise = exercies;
        this.exercisesChange.next([...this.availableExercise]);
      });
  }

  startExercise(selectedId: string) {
    this.runningExercise = this.availableExercise.find(
      (ex) => ex.id == selectedId
    );
    this.exerciseChange.next({ ...this.runningExercise });
  }

  completeExercise() {
    this.exercises!.push({
      ...this.runningExercise!,
      date: new Date(),
      state: 'completed',
    });
    this.runningExercise = null!;
    this.exerciseChange.next(null);
  }

  cancelledExercise(progress: number) {
    this.exercises!.push({
      ...this.runningExercise!,
      date: new Date(),
      duration: this.runningExercise!.duration * (progress / 100),
      calories: this.runningExercise!.duration * (progress / 100),
      state: 'cancelled',
    });
    this.runningExercise = null!;
    this.exerciseChange.next(null);
  }

  getRunningExercise() {
    return { ...this.runningExercise };
  }

  getPastExercise() {
    return this.exercises?.slice();
  }
}
