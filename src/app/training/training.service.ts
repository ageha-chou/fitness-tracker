import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, Subject, Subscription } from 'rxjs';
import { Exercise } from './exercies.model';

@Injectable({ providedIn: 'root' })
export class TrainingService {
  private availableExercises: Exercise[] = [];
  private runningExercise: Exercise | undefined;

  exerciseChanged = new Subject<Exercise | undefined>();
  exercisesChanged = new Subject<Exercise[]>();
  finishedExercisesChanged = new Subject<Exercise[]>();
  private fbSubs: Subscription[] = [];

  constructor(private firestore: AngularFirestore) {}

  fetchAvailableExercises() {
    const sub = this.firestore
      .collection('availableExercises')
      .snapshotChanges()
      .pipe<Exercise[]>(
        map((docArray) => {
          return docArray.map((docData) => {
            return {
              ...(docData.payload.doc.data() as Exercise),
              id: docData.payload.doc.id,
            };
          });
        })
      )
      .subscribe((exercises) => {
        this.availableExercises = exercises;
        this.exercisesChanged.next([...this.availableExercises]);
      });
    this.fbSubs.push(sub);
  }

  get getRunningExercise() {
    return { ...this.runningExercise };
  }

  fetchFinishedExercises() {
    const sub = this.firestore
      .collection<Exercise>('finishedExercises')
      .valueChanges()
      .subscribe((exercises) => {
        this.finishedExercisesChanged.next(exercises);
      });
    this.fbSubs.push(sub);
  }

  startExercise(selectedId: string) {
    this.runningExercise = this.availableExercises.find(
      (ex) => ex.id === selectedId
    );
    this.firestore
      .doc('availableExercises/' + selectedId)
      .update({ lastSelected: new Date() });
    this.exerciseChanged.next(this.runningExercise);
  }

  stopExercise(progress: number) {
    if (this.runningExercise != undefined) {
      const exercise: Exercise = {
        ...this.runningExercise,
        state: 'cancelled',
        date: new Date(),
        duration: (this.runningExercise.duration * progress) / 100,
        calories: (this.runningExercise.calories * progress) / 100,
      };
      this.addDataToDb(exercise);
    }

    this.runningExercise = undefined;
    this.exerciseChanged.next(this.runningExercise);
  }

  completeExercise() {
    if (this.runningExercise != undefined) {
      const exercise: Exercise = {
        ...this.runningExercise,
        state: 'completed',
        date: new Date(),
      };
      this.addDataToDb(exercise);
    }

    this.runningExercise = undefined;
    this.exerciseChanged.next(this.runningExercise);
  }

  cancelSubs() {
    this.fbSubs.forEach((sub) => sub.unsubscribe());
  }

  private addDataToDb(exercise: Exercise) {
    this.firestore.collection('finishedExercises').add(exercise);
  }
}
