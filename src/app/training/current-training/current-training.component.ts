import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { take } from 'rxjs';
import { TrainingService } from '../training.service';

import { StopTrainingComponenet } from './stop-training.component';

@Component({
  selector: 'app-current-training',
  templateUrl: './current-training.component.html',
  styleUrls: ['./current-training.component.css'],
})
export class CurrentTrainingComponent implements OnInit, OnDestroy {
  progress = 0;
  progressInterval: any;

  constructor(
    private dialog: MatDialog,
    private trainingService: TrainingService
  ) {}

  ngOnInit(): void {
    this.startTraining();
  }

  private startTraining() {
    const step =
      (this.trainingService.getRunningExercise.duration! / 100) * 1000;
    console.log(step);
    this.progressInterval = setInterval(() => {
      this.progress = this.progress + 1;
      if (this.progress >= 100) {
        this.stopTraining();
      }
    }, step);
  }

  private stopTraining() {
    clearInterval(this.progressInterval);
  }

  onStopTraining() {
    clearInterval(this.progressInterval);
    const dialogRef = this.dialog.open(StopTrainingComponenet, {
      data: { progress: this.progress },
    });

    dialogRef
      .afterClosed()
      .pipe(take(1))
      .subscribe((stopConfirm: boolean) => {
        if (!stopConfirm) {
          this.startTraining();
        } else {
          this.trainingService.stopExercise(this.progress);
        }
      });
  }

  complete() {
    this.trainingService.completeExercise();
  }

  ngOnDestroy(): void {
    if (this.progress >= 100) {
      this.complete();
    }

    if (!this.progressInterval) {
      this.stopTraining();
    }
  }
}
