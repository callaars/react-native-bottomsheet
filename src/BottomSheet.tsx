import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  Dimensions,
  LayoutChangeEvent,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  ViewStyle,
} from 'react-native';
import Animated, {
  and,
  block,
  call,
  Clock,
  clockRunning,
  cond,
  Easing,
  eq,
  interpolate,
  neq,
  not,
  set,
  startClock,
  stopClock,
  timing,
  useCode,
  useValue,
  Value,
} from 'react-native-reanimated';
import type { ListenerFunction } from './emitter';
import {
  addBottomSheetListener,
  getCurrentAction,
  removeBottomSheetListener,
} from './emitter';
import useBottomSheets from './useBottomSheets';

type BottomSheetProps = {
  sheetName?: string;
};

const runTiming = (clock: Clock, toValue: Animated.Value<number>) => {
  const state = {
    finished: new Value(0),
    position: new Value(0),
    frameTime: new Value(0),
    time: new Value(0),
  };

  const config = {
    toValue, // : new Value(1),
    duration: 150,
    easing: Easing.inOut(Easing.ease),
  };

  return block([
    cond(
      not(clockRunning(clock)),
      set(state.time, 0),
      timing(clock, state, config)
    ),

    cond(eq(state.finished, 1), [
      stopClock(clock),
      set(state.finished, 0),
      set(state.frameTime, 0),
      set(state.time, 0),
    ]),
    state.position,
  ]);
};

const { height: deviceHeight } = Dimensions.get('window');

export const BottomSheet: React.FC<BottomSheetProps> = (props) => {
  const { closeBottomSheet } = useBottomSheets();
  const { children, sheetName } = props;

  const clock = useRef<Clock>(new Clock());

  let height = useRef<number>(deviceHeight);

  const onLayout = useCallback((event: LayoutChangeEvent) => {
    height.current = event.nativeEvent.layout.height;
  }, []);

  const progress = useValue(0);
  const isActive = useValue<0 | 1>(0);
  const previousActive = useValue<0 | 1>(0);
  const [visible, setVisible] = useState<boolean>();
  const bottom = useValue(-height.current);
  const opacity = useValue(0);

  useCode(() => set(isActive, visible ? 1 : 0), [visible]);
  useCode(
    () => [
      cond(neq(previousActive, isActive), [
        cond(not(clockRunning(clock.current)), startClock(clock.current)),
      ]),
      set(progress, runTiming(clock.current, isActive)),
      set(
        opacity,
        interpolate(progress, {
          inputRange: [0, 1],
          outputRange: [0, 0.5],
        })
      ),
      set(
        bottom,
        interpolate(progress, {
          inputRange: [0, 1],
          outputRange: [-height.current, 0],
        })
      ),
      set(previousActive, isActive),
      cond(and(not(clockRunning(clock.current)), eq(isActive, 0)), [
        call([], () => setVisible(false)),
      ]),
    ],
    []
  );

  useEffect(() => {
    const currentAction = getCurrentAction();

    switch (currentAction.action) {
      case 'close':
        isActive.setValue(0);
        break;
      case 'open':
        if (currentAction.name === sheetName) {
          setVisible(true);
        } else {
          isActive.setValue(0);
        }
    }

    const listener: ListenerFunction = (action, name) => {
      switch (action) {
        case 'open':
          if (name === sheetName) {
            setVisible(true);
          } else {
            isActive.setValue(0);
          }
          break;
        case 'close':
          isActive.setValue(0);
          break;
      }
    };

    addBottomSheetListener(listener);

    return () => {
      removeBottomSheetListener(listener);
    };
  }, [isActive, sheetName]);

  const currentDisplayStyle: ViewStyle = useMemo(
    () => ({ display: visible ? 'flex' : 'none' }),
    [visible]
  );

  return visible ? (
    <View style={[styles.border, currentDisplayStyle]} onLayout={onLayout}>
      <TouchableWithoutFeedback onPress={() => closeBottomSheet()}>
        <Animated.View
          style={[styles.backdrop, { opacity }]}
          collapsable={false}
        />
      </TouchableWithoutFeedback>
      <Animated.View style={[styles.container, { bottom }]}>
        {children}
      </Animated.View>
    </View>
  ) : null;
};

const styles = StyleSheet.create({
  border: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 100,
    elevation: 100,
  },
  backdrop: {
    ...StyleSheet.absoluteFillObject,
    opacity: 0.5,
    backgroundColor: 'black',
    zIndex: 1,
    elevation: 1,
  },
  container: {
    position: 'absolute',
    backgroundColor: 'white',
    padding: 20,
    borderTopRightRadius: 10,
    borderTopLeftRadius: 10,
    width: '100%',
    bottom: -deviceHeight * 2,
    left: 0,
    zIndex: 2,
    elevation: 2,
  },
});

export default BottomSheet;
