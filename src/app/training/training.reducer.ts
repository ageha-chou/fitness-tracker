import { Exercise } from './exercies.model';
import * as fromRoot from '../app.reducer';
import {
  SET_AVAILABLE_TRAINING,
  SET_FINISHED_TRAINING,
  START_TRAINING,
  STOP_TRAINING,
  TrainingActions,
} from './training.action';
import { createFeatureSelector, createSelector } from '@ngrx/store';

export interface TrainingState {
  availableExercises: Exercise[];
  finishiedExercises: Exercise[];
  activeTraining?: Exercise;
}

export interface State extends fromRoot.State {
  training: TrainingState;
}

const initState: TrainingState = {
  availableExercises: [],
  finishiedExercises: [],
  activeTraining: undefined,
};

export function trainingReducer(
  state: TrainingState = initState,
  action: TrainingActions
) {
  switch (action.type) {
    case SET_AVAILABLE_TRAINING:
      return {
        ...state,
        availableExercises: action.payload,
      };
    case SET_FINISHED_TRAINING:
      return {
        ...state,
        finishiedExercises: action.payload,
      };
    case START_TRAINING:
      return {
        ...state,
        activeTraining: {
          ...state.availableExercises.find((ex) => ex.id === action.payload),
        },
      };
    case STOP_TRAINING:
      return {
        ...state,
        activeTraining: null,
      };
    default:
      return state;
  }
}

export const getTrainingState =
  createFeatureSelector<TrainingState>('training');

export const getAvailableTraining = createSelector(
  getTrainingState,
  (state: TrainingState) => state.availableExercises
);

export const getFinishedTraining = createSelector(
  getTrainingState,
  (state: TrainingState) => state.finishiedExercises
);

export const getActiveExercise = createSelector(
  getTrainingState,
  (state: TrainingState) => state.activeTraining
);

export const getIsTraining = createSelector(
  getTrainingState,
  (state: TrainingState) => !!state.activeTraining
);
