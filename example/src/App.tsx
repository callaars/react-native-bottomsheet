import { useCallback } from 'react';
import * as React from 'react';

import { StyleSheet, View, Text, Button } from 'react-native';
import {
  BottomSheet,
  BottomSheetModal,
  useBottomSheets,
  BottomSheetModalProvider,
} from '../../src';

type OnTheFlyProps = { closeBottomSheet: () => void };

const OnTheFly = ({ closeBottomSheet }: OnTheFlyProps) => (
  <BottomSheetModal name="examply-create">
    <BottomSheet>
      <View>
        <Text>Hello from on-the-fly bottom sheet.</Text>
      </View>
      <View>
        <Button title="Close" onPress={() => closeBottomSheet()} />
      </View>
    </BottomSheet>
  </BottomSheetModal>
);

export default function App() {
  const {
    openBottomSheet,
    closeBottomSheet,
    createBottomSheet,
  } = useBottomSheets();

  const onPressOnTheFly = useCallback(() => {
    createBottomSheet({
      sheetName: 'examply-create',
      instantOpen: true,
      component: OnTheFly({ closeBottomSheet }),
    });
  }, [closeBottomSheet, createBottomSheet]);

  return (
    <BottomSheetModalProvider>
      <View style={styles.container}>
        <Text>Hello from app.</Text>
        <Button
          title="Open bottom instantiated sheet"
          onPress={() => {
            openBottomSheet('example');
          }}
        />
        <Button title="Create on-the-fly sheet" onPress={onPressOnTheFly} />
      </View>
      <BottomSheetModal name="example">
        <BottomSheet>
          <View style={styles.bottomSheet}>
            <Text>Hello from bottom sheet.</Text>
          </View>
          <View>
            <Button title="Close" onPress={() => closeBottomSheet()} />
          </View>
        </BottomSheet>
      </BottomSheetModal>
    </BottomSheetModalProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  box: {
    width: 60,
    height: 60,
    marginVertical: 20,
  },
  bottomSheet: {
    height: 200,
  },
});
