import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TrainingService } from '../training.service';
import { Observable, Subscription } from 'rxjs';
import { Exercise } from '../exercies.model';
import * as fromRoot from '../../app.reducer';
import { Store } from '@ngrx/store';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css'],
})
export class NewTrainingComponent implements OnInit {
  exercises: Exercise[] | undefined = [];
  private exercisesSub: Subscription | undefined;
  isLoading$!: Observable<boolean>;

  constructor(private trainingService: TrainingService, private store: Store) {}

  ngOnInit(): void {
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);

    this.exercisesSub = this.trainingService.exercisesChanged.subscribe(
      (exercises) => {
        this.exercises = exercises;
      }
    );

    this.fetchExercises();
  }

  onStartTraining(f: NgForm) {
    if (f.value.exercise) {
      this.trainingService.startExercise(f.value.exercise);
    }
  }

  fetchExercises() {
    this.trainingService.fetchAvailableExercises();
  }

  ngOnDestroy(): void {
    this.exercisesSub?.unsubscribe();
  }
}
