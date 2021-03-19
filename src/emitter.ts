export type Action = 'open' | 'close';
export type ListenerFunction = (action: Action, name?: string) => void;

let currentAction: { action: Action; name?: string } = {
  action: 'close',
  name: '__UNUSED',
};

// This most likely has only one listener
const listeners: Set<ListenerFunction> = new Set();

export const addBottomSheetListener = (listener: ListenerFunction) => {
  listeners.add(listener);
};

export const removeBottomSheetListener = (listener: ListenerFunction) => {
  listeners.delete(listener);
};

export const emit = (action: Action, name?: string) => {
  currentAction = { action, name };
  listeners.forEach((listener) => listener(action, name));
};

export const getCurrentAction = () => currentAction;
