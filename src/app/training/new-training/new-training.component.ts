import { Component, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { TrainingService } from '../training.service';
import { Observable, Subscription } from 'rxjs';
import { Exercise } from '../exercies.model';
import { UIService } from 'src/app/shared/ui.service';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css'],
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  exercises: Exercise[] | undefined = [];
  exercisesSub!: Subscription;
  isLoading = false;
  private loadingSub!: Subscription;

  constructor(
    private trainingService: TrainingService,
    private uiService: UIService
  ) {}

  ngOnInit(): void {
    this.loadingSub = this.uiService.loadingStateChanged.subscribe(
      (isLoading) => {
        this.isLoading = isLoading;
      }
    );
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
    this.loadingSub.unsubscribe();
    this.exercisesSub.unsubscribe();
  }
}
