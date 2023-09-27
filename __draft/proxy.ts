type EffectCb<T> = (changes: { all: T; changed: Partial<T>; fromCache: boolean }) => void;

export function createProxy<T extends object>(data: T) {
  let cache = data;
  const observers = new Set<EffectCb<T>>();

  function effect(callback: EffectCb<T>): void {
    callback({ all: { ...cache }, changed: {}, fromCache: true });
    observers.add(callback);
  }

  const proxy = new Proxy(data, {
    get(target, p: string) {
      const value = target[p as keyof typeof target];

      if (value instanceof Function) {
        return (...args: any[]) => {
          return value(...args);
        };
      }

      return value;
    },
    set(target, prop, newValue) {
      target[prop as keyof typeof target] = newValue;
      cache = target;

      observers.forEach((observer) =>
        observer({
          all: { ...cache },
          changed: { [prop]: newValue } as Partial<T>,
          fromCache: false,
        })
      );
      return true;
    },
  });

  return [proxy, effect] as const;
}
