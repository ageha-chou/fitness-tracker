import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { map, Subscription, take } from 'rxjs';
import { UIService } from '../shared/ui.service';
import { Exercise } from './exercies.model';
import * as UI from '../shared/ui.actions';
import { Store } from '@ngrx/store';
import * as fromTraining from './training.reducer';
import * as training from './training.action';

@Injectable({ providedIn: 'root' })
export class TrainingService {
  private fbSubs: Subscription[] = [];

  constructor(
    private firestore: AngularFirestore,
    private uiService: UIService,
    private store: Store<fromTraining.State>
  ) {}

  fetchAvailableExercises() {
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
          this.store.dispatch(new training.SetAvailableTraining(exercises));
        },
        error: (error) => {
          this.store.dispatch(new UI.StartLoading());
          this.uiService.showSnackbar(
            'Fetching data failed. Please try again later'
          );
          this.store.dispatch(new training.SetAvailableTraining(undefined));
        },
      });
    this.fbSubs.push(sub);
  }

  fetchFinishedExercises() {
    const sub = this.firestore
      .collection<Exercise>('finishedExercises')
      .valueChanges()
      .subscribe((exercises) => {
        this.store.dispatch(new training.SetFinishedTraining(exercises));
      });
    this.fbSubs.push(sub);
  }

  startExercise(selectedId: string) {
    this.firestore
      .doc('availableExercises/' + selectedId)
      .update({ lastSelected: new Date() });
    this.store.dispatch(new training.StartTraining(selectedId));
  }

  stopExercise(progress: number) {
    this.store
      .select(fromTraining.getActiveExercise)
      .pipe(take(1))
      .subscribe((ex) => {
        if (ex != undefined) {
          const exercise: Exercise = {
            ...ex,
            state: 'cancelled',
            date: new Date(),
            duration: (ex.duration * progress) / 100,
            calories: (ex.calories * progress) / 100,
          };
          this.addDataToDb(exercise);
          this.store.dispatch(new training.StopTraining());
        }
      });
  }

  completeExercise() {
    this.store
      .select(fromTraining.getActiveExercise)
      .pipe(take(1))
      .subscribe((ex) => {
        if (ex != undefined) {
          const exercise: Exercise = {
            ...ex,
            state: 'completed',
            date: new Date(),
          };
          this.addDataToDb(exercise);
          this.store.dispatch(new training.StopTraining());
        }
      });
  }

  cancelSubs() {
    this.fbSubs.forEach((sub) => sub.unsubscribe());
  }

  private addDataToDb(exercise: Exercise) {
    this.firestore.collection('finishedExercises').add(exercise);
  }
}
