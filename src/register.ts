export type Register = {
  [name: string]: Element;
};

type ListenerFunction = (register: Register) => void;

const register: Register = {};

const listeners: Set<ListenerFunction> = new Set();

export const addToRegister = (name: string, component: Element) => {
  register[name] = component;
  listeners.forEach((listener) => listener(register));
};

export const removeFromRegister = (name: string) => {
  delete register[name];
  listeners.forEach((listener) => listener(register));
};

export const addRegisterListener = (listener: ListenerFunction) => {
  listeners.add(listener);
};

export const removeRegisterListener = (listener: ListenerFunction) =>
  listeners.delete(listener);

export const getRegister = () => register;
