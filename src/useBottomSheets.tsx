import { Portal } from '@callaars/react-native-portal';
import React, { ReactElement, useCallback, useMemo } from 'react';
import { emit } from './emitter';
import { addToRegister } from './register';

type CreateBottomSheetOptions = {
  sheetName: string;
  component: ReactElement;
  instantOpen?: boolean;
};

export const useBottomSheets = () => {
  const openBottomSheet = useCallback((sheetName: string) => {
    emit('open', sheetName);
  }, []);

  const closeBottomSheet = useCallback(() => {
    emit('close');
  }, []);

  const createBottomSheet = useCallback((options: CreateBottomSheetOptions) => {
    const { sheetName, component, instantOpen } = options;

    const sanitizedComponent = React.Children.map(component, (child) =>
      React.cloneElement(child, {
        unregisterOnUnmount: false,
      })
    );

    addToRegister(
      sheetName,
      <Portal key={sheetName}>{sanitizedComponent}</Portal>
    );

    if (instantOpen) {
      emit('open', sheetName);
    }
  }, []);

  return useMemo(
    () => ({
      openBottomSheet,
      closeBottomSheet,
      createBottomSheet,
    }),
    [closeBottomSheet, createBottomSheet, openBottomSheet]
  );
};

export default useBottomSheets;
