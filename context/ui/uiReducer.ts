import { UiState } from './';

type UiActionType = { type: 'Ui - toggleMenu' };

export const UiReducer = (state: UiState, action: UiActionType): UiState => {
  switch (action.type) {
    case 'Ui - toggleMenu':
      return {
        ...state,
        isMenuOpen: !state.isMenuOpen,
      };

    default:
      return state;
  }
};
