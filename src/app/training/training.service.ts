import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, Subject, Subscription } from 'rxjs';
import { UIService } from '../shared-UI/ui.service';
import { Exercise } from './exercise.model';

@Injectable()
export class TrainingService {
  exerciseChange = new Subject();
  exercisesChange = new Subject();
  finishedExercisesChanged = new Subject<Exercise[]>();
  private availableExercise: Exercise[] = [];
  private runningExercise?: Exercise;
  private fbSubs: Subscription[] = [];

  constructor(public db: AngularFirestore, private uiService: UIService) {}
  fetchAvailableExercises() {
    this.uiService.loadingStateChanged.next(true);
    this.fbSubs.push(
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
        .subscribe(
          (exercies: Exercise[]) => {
            this.availableExercise = exercies;
            this.exercisesChange.next([...this.availableExercise]);
            this.uiService.loadingStateChanged.next(false);
          },
          (error) => {
            this.uiService.showSnackBar(
              'Error fectching exercises, please try again later.',
              null,
              5000
            );
            this.uiService.loadingStateChanged.next(false);
            this.exercisesChange.next(null);
          }
        )
    );
  }

  startExercise(selectedId: string) {
    this.runningExercise = this.availableExercise.find(
      (ex) => ex.id == selectedId
    );
    this.exerciseChange.next({ ...this.runningExercise });
  }

  completeExercise() {
    this.addDatatoDB({
      ...this.runningExercise!,
      date: new Date(),
      state: 'completed',
    });
    this.runningExercise = null!;
    this.exerciseChange.next(null);
  }

  cancelledExercise(progress: number) {
    this.addDatatoDB({
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
    this.fbSubs.push(
      this.db
        .collection('finishedExercise')
        .valueChanges()
        .subscribe((exercise: Exercise[]) => {
          this.finishedExercisesChanged.next(exercise);
        })
    );
  }

  cancelFbSubs() {
    this.fbSubs.forEach((subs) => {
      subs.unsubscribe;
    });
  }
  private addDatatoDB(exercise: Exercise) {
    this.db.collection('finishedExercise').add(exercise);
  }
}
