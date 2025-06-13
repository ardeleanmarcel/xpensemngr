import React, { useCallback, useMemo, useState } from 'react';

import { AddExpenseDialog } from '../../components/modals/AddExpense/AddExpenseDialog';
import { Modal, modalContext, ShowModalOptions } from './modal.context';

export function ModalContextProvider({ children }: React.PropsWithChildren) {
  const [isVisible, setIsVisible] = useState(false);
  const [modal, setModal] = useState<Modal | null>(null);
  const [modalProps, setModalProps] = useState<Record<string, unknown>>({});

  const show = useCallback((opt: ShowModalOptions) => {
    const { type: modal, props } = opt;

    setModal(modal);
    setModalProps(props || {});
    setIsVisible(true);
  }, []);

  const contextValue = useMemo(() => ({ show }), [show]);

  const resetState = useCallback(() => {
    setIsVisible(false);
    setModal(null);
    setModalProps({});
  }, []);

  // TODO (Valle) -> how can type safety be enforced on the modal propd
  // so that the right props are passed to the right modal?
  const renderModal = useCallback(() => {
    switch (modal) {
      case Modal.AddExpense:
        return <AddExpenseDialog isOpen={isVisible} onClose={resetState} {...modalProps} />;
      case Modal.AddLabel:
        // Replace with actual AddLabelDialog when implemented
        return <AddExpenseDialog isOpen={isVisible} onClose={resetState} {...modalProps} />;
      default:
        return null;
    }
  }, [modal, isVisible, modalProps, resetState]);

  return (
    <modalContext.Provider value={contextValue}>
      {renderModal()}
      {children}
    </modalContext.Provider>
  );
}
