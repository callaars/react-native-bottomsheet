import { PortalProvider } from '@callaars/react-native-portal';
import React, { useEffect, useState } from 'react';
import {
  addRegisterListener,
  getRegister,
  Register,
  removeRegisterListener,
} from './register';

type BottomSheetModalProviderProps = {};

const RegisterRenderer = () => {
  const [register, setRegister] = useState<Element[]>([]);

  useEffect(() => {
    setRegister(
      Object.keys(getRegister()).map((sheetName) => {
        return getRegister()[sheetName];
      })
    );

    const listener = (newRegister: Register) => {
      setRegister(
        Object.keys(newRegister).map((sheetName) => newRegister[sheetName])
      );
    };

    addRegisterListener(listener);

    return () => {
      removeRegisterListener(listener);
    };
  }, []);

  return <>{register}</>;
};
export const BottomSheetModalProvider: React.FC<BottomSheetModalProviderProps> = (
  props
) => {
  const { children } = props;

  return (
    <PortalProvider>
      {children}
      <RegisterRenderer />
    </PortalProvider>
  );
};

export default BottomSheetModalProvider;
