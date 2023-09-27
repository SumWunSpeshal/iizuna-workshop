import { AbstractComponent, Component, ComponentFactory, EventListener, OnReady } from 'iizuna';
import { ComponentOptions } from 'iizuna/lib/decorators/component.decorator';

function createEventPair<const T = void>() {
  const eventName = crypto.randomUUID();

  return [
    EventDispatcher<T, AbstractComponent>(eventName),
    EventListener(eventName) as (target: any, propertyKey: string) => void,
  ] as const;
}

export const [Increment, OnIncrement] = createEventPair();
export const [Decrement, OnDecrement] = createEventPair();
export const [Reset, OnReset] = createEventPair();
export const [Update, OnUpdate] = createEventPair<(prev: number) => number>();
export const [Set, OnSet] = createEventPair<number>();

function EventDispatcher<T, TComponent extends AbstractComponent>(name: string) {
  function emit(elem: Element | undefined, config: T) {
    const event = new CustomEvent(name, {
      detail: config,
      bubbles: true,
    } as CustomEventInit<T>);
    elem?.dispatchEvent(event);
    return config;
  }

  return (
    _: TComponent,
    __: string,
    descriptor: TypedPropertyDescriptor<(...args: any[]) => T>
  ) => {
    if (!(descriptor.value instanceof Function)) {
      throw new Error('Decorate a method, dumbass');
    }

    const originalMethod = descriptor.value;

    descriptor.value = function (...args: any[]) {
      const self: AbstractComponent<ComponentOptions> = this as any;
      const result = originalMethod.apply(self, args);
      return emit(self.element, result);
    };

    return descriptor;
  };
}

function CssClass(name?: string) {
  return function (target: AbstractComponent, key: string) {
    ComponentFactory.onComponentClassInitialized((instance) => {
      let value: string = name || key;

      const getter = () => value;
      const setter = (newVal: string) => {
        instance?.element.classList.remove(value);
        instance?.element.classList.add(newVal);
        value = newVal;
      };

      Object.defineProperty(instance, key, {
        get: getter,
        set: setter,
        enumerable: true,
        configurable: true,
      });
    }, target);
  };
}

@Component({
  selector: 'my-first-component',
})
export class MyFirstComponent extends AbstractComponent implements OnReady {
  declare element: HTMLElement;

  @CssClass()
  on?: string;

  onReady(): void {}

  @EventListener()
  click() {
    this.on;
    this.on = this.on === 'on' ? 'off' : 'on';
  }

  @Increment
  increment() {}

  @EventListener('click')
  @Decrement
  decrement() {}

  @Reset
  reset() {}

  @Set
  set() {
    return 3;
  }

  @Update
  update() {
    return (v: number) => v + 2;
  }
}
