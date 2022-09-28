import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
import { Exercise } from './exercies.model';

@Injectable({ providedIn: 'root' })
export class TrainingService {
  private availableExercises: Exercise[] = [
    { id: 'crunches', name: 'Crunches', duration: 30, calories: 80 },
    { id: 'touch-toes', name: 'Touch Toes', duration: 180, calories: 15 },
    { id: 'side-lunges', name: 'Side Lunges', duration: 120, calories: 18 },
    { id: 'burpees', name: 'Burpees', duration: 60, calories: 8 },
  ];

  private exercises: Exercise[] = [];
  private runningExercise: Exercise | undefined;
  exerciseChanged = new Subject<Exercise | undefined>();

  get getAvailableExercises() {
    return this.availableExercises.slice();
  }

  get getRunningExercise() {
    return { ...this.runningExercise };
  }

  get getExercises() {
    return this.exercises.slice();
  }

  startExercise(selectedId: string) {
    this.runningExercise = this.availableExercises.find(
      (ex) => ex.id === selectedId
    );
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
      this.exercises.push(exercise);
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
      this.exercises.push(exercise);
    }

    this.runningExercise = undefined;
    this.exerciseChanged.next(this.runningExercise);
  }
}
