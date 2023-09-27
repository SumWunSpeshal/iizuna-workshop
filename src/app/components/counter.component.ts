import { AbstractComponent, Component, ElementAttribute } from 'iizuna';
import { OnDecrement, OnIncrement, OnReset, OnSet, OnUpdate } from './my-first-component';

@Component({
  selector: 'count',
})
export class CounterComponent extends AbstractComponent {
  static readonly eventName = crypto.randomUUID();

  private _count = 0;

  get count() {
    return this._count;
  }

  @ElementAttribute()
  set count(count: number) {
    this.element.setAttribute('data-count', count.toString());
    this._count = parseInt(count as any);
  }

  @OnIncrement
  increment(): void {
    this.count++;
  }

  @OnDecrement
  decrement(): void {
    this.count--;
  }

  @OnSet
  set(elem: Element, event: CustomEvent) {
    this.count = event.detail;
  }

  @OnReset
  reset(elem: Element, event: CustomEvent) {
    this.count = event.detail;
  }

  @OnUpdate
  update(elem: Element, event: CustomEvent) {
    this.count = event.detail(this.count);
  }
}
