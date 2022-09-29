import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, Subject, Subscription } from 'rxjs';
import { UIService } from '../shared/ui.service';
import { Exercise } from './exercies.model';
import * as UI from '../shared/ui.actions';
import { Store } from '@ngrx/store';

@Injectable({ providedIn: 'root' })
export class TrainingService {
  private availableExercises: Exercise[] | null = [];
  private runningExercise: Exercise | undefined;

  exerciseChanged = new Subject<Exercise | undefined>();
  exercisesChanged = new Subject<Exercise[] | undefined>();
  finishedExercisesChanged = new Subject<Exercise[]>();
  private fbSubs: Subscription[] = [];

  constructor(
    private firestore: AngularFirestore,
    private uiService: UIService,
    private store: Store
  ) {}

  fetchAvailableExercises() {
    //   this.uiService.loadingStateChanged.next(true);
    this.store.dispatch(new UI.StartLoading());
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
      .subscribe({
        next: (exercises) => {
          this.store.dispatch(new UI.StopLoading());
          this.availableExercises = exercises;
          this.exercisesChanged.next([...this.availableExercises]);
        },
        error: (error) => {
          console.log('error');
          this.store.dispatch(new UI.StartLoading());
          this.uiService.showSnackbar(
            'Fetching data failed. Please try again later'
          );
          this.exercisesChanged.next(undefined);
        },
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
    this.runningExercise = this.availableExercises?.find(
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
