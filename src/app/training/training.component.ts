import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Exercise } from './exercies.model';
import { TrainingService } from './training.service';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.css'],
})
export class TrainingComponent implements OnInit, OnDestroy {
  onGoingTraining = false;
  exercises: Exercise[] = [];
  exerciseChangedSub!: Subscription;

  constructor(private trainingExercise: TrainingService) {}

  ngOnInit(): void {
    this.exerciseChangedSub = this.trainingExercise.exerciseChanged.subscribe(
      (exercise) => {
        this.onGoingTraining = !!exercise;
      }
    );
  }

  ngOnDestroy(): void {
    this.exerciseChangedSub.unsubscribe();
  }
}
