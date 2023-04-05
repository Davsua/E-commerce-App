import { useReducer } from 'react';

import { UiContext, UiReducer } from './';
//definir estado de la aplicacion

type Props = {
  children?: React.ReactNode;
};

export interface UiState {
  isMenuOpen: boolean;
}

const UI_INITIAL_STATE: UiState = {
  isMenuOpen: false,
};
export const UiProvider: React.FC<Props> = ({ children }) => {
  const [state, dispatch] = useReducer(UiReducer, UI_INITIAL_STATE);

  const toggleSideMenu = () => {
    dispatch({ type: 'Ui - toggleMenu' });
  };

  return (
    <UiContext.Provider
      value={{
        ...state,

        //methods
        toggleSideMenu,
      }}
    >
      {children}
    </UiContext.Provider>
  );
};
