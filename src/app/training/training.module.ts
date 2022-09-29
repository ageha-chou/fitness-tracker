import { NgModule } from '@angular/core';
import { TrainingRoutingModule } from './training-routing.module';
import { TrainingComponent } from './training.component';
import { CurrentTrainingComponent } from './current-training/current-training.component';
import { NewTrainingComponent } from './new-training/new-training.component';
import { PastTrainingComponent } from './past-training/past-training.component';
import { StopTrainingComponenet } from './current-training/stop-training.component';
import { SharedModule } from '../shared/shared.module';

@NgModule({
  declarations: [
    TrainingComponent,
    CurrentTrainingComponent,
    NewTrainingComponent,
    PastTrainingComponent,
    StopTrainingComponenet,
  ],
  imports: [TrainingRoutingModule, SharedModule],
  entryComponents: [StopTrainingComponenet],
})
export class TrainingModule {}
