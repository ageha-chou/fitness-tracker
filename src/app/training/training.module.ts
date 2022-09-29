import { NgModule } from '@angular/core';
import { StoreModule } from '@ngrx/store';
import { TrainingRoutingModule } from './training-routing.module';
import { TrainingComponent } from './training.component';
import { CurrentTrainingComponent } from './current-training/current-training.component';
import { NewTrainingComponent } from './new-training/new-training.component';
import { PastTrainingComponent } from './past-training/past-training.component';
import { StopTrainingComponenet } from './current-training/stop-training.component';
import { SharedModule } from '../shared/shared.module';
import { trainingReducer } from './training.reducer';

@NgModule({
  declarations: [
    TrainingComponent,
    CurrentTrainingComponent,
    NewTrainingComponent,
    PastTrainingComponent,
    StopTrainingComponenet,
  ],
  imports: [
    TrainingRoutingModule,
    SharedModule,
    StoreModule.forFeature('training', trainingReducer),
  ],
  entryComponents: [StopTrainingComponenet],
})
export class TrainingModule {}
