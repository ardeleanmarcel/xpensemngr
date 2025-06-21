import React from 'react';

export enum Modal {
  AddExpense = 'ADD_EXPENSE',
  AddLabel = 'ADD_LABEL',
  EditLabel = 'EDIT_LABEL',
}

// TODO (Valle) -> ShowModalOptions should be a discrimanted union of
// modals and their props
export type ShowModalOptions = {
  type: Modal;
  props?: Record<string, unknown>;
};

type ModalContextType = {
  show: ({ type, props }: ShowModalOptions) => void;
};

export const modalContext = React.createContext<ModalContextType>({
  show: () => null,
});

export const useModal = () => {
  return React.useContext(modalContext);
};
