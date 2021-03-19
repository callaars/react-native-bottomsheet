import { Portal } from '@callaars/react-native-portal';
import React, { ReactElement, useEffect } from 'react';
import BottomSheet from './BottomSheet';
import { addToRegister, removeFromRegister } from './register';

type BottomSheetModalProps = { name: string; unregisterOnUnmount?: boolean };

export const BottomSheetModal: React.FC<BottomSheetModalProps> = (props) => {
  const { children, name, unregisterOnUnmount = true } = props;

  useEffect(() => {
    const sanitizedChildren = React.Children.map(
      children as ReactElement[],
      (child) => {
        if (child.type === BottomSheet) {
          return React.cloneElement(child, {
            sheetName: name,
          });
        }

        return child;
      }
    );

    addToRegister(name, <Portal key={name}>{sanitizedChildren}</Portal>);

    if (unregisterOnUnmount) {
      return () => {
        removeFromRegister(name);
      };
    }

    return;
  }, [children, name, unregisterOnUnmount]);

  return null;
};

export default BottomSheetModal;
