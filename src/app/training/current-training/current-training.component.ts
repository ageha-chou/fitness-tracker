import {
  Component,
  EventEmitter,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { take } from 'rxjs';

import { StopTrainingComponenet } from './stop-training.component';

@Component({
  selector: 'app-current-training',
  templateUrl: './current-training.component.html',
  styleUrls: ['./current-training.component.css'],
})
export class CurrentTrainingComponent implements OnInit, OnDestroy {
  @Output() trainingStop = new EventEmitter();
  progress = 0;
  progressInterval: any;

  constructor(private dialog: MatDialog) {}

  ngOnInit(): void {
    this.startTraining();
  }

  private startTraining() {
    this.progressInterval = setInterval(() => {
      this.progress = this.progress + 5;
      if (this.progress >= 100) {
        this.stopTraining();
      }
    }, 1000);
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
          this.back();
        }
      });
  }

  back() {
    this.trainingStop.emit();
  }

  ngOnDestroy(): void {
    if (!this.progressInterval) {
      this.stopTraining();
    }
  }
}
