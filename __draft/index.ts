import { createProxy } from './proxy';

const [proxy, effect] = createProxy({
  foo: 3,
  bar: 4,
  get derivedBar() {
    return this.bar + 1;
  },
});

effect(({ all, changed, fromCache }) => {
  console.log(all);
  console.log('derivedBar', all.derivedBar);
});

proxy.bar = 5;
proxy.bar = 6;
proxy.bar = 7;
