import { AbstractComponent, Component, ElementAttribute } from 'iizuna';

@Component({
  selector: 'count',
})
export class CounterComponent extends AbstractComponent {
  private _count = 0;

  get count() {
    return this._count;
  }

  @ElementAttribute()
  set count(count: number) {
    this.element.setAttribute('data-count', count.toString());
    this._count = parseInt(count as any);
  }
}
