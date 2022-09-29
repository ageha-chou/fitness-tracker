import { UIActions, START_LOADING, STOP_LOADING } from './ui.actions';

export interface State {
  isLoading: boolean;
}

const initState: State = {
  isLoading: false,
};

export function uiReducer(state = initState, action: any) {
  switch (action.type) {
    case START_LOADING:
      return {
        isLoading: true,
      };
    case STOP_LOADING:
      return { isLoading: false };
    default:
      return state;
  }
}

export const getIsLoading = (state: State) => state.isLoading;
