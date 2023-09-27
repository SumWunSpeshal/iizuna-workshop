import { ComponentFactory } from 'iizuna';
import { CounterComponent } from './components/counter.component';
import { MyFirstComponent } from './components/my-first-component';

ComponentFactory.registerComponents([MyFirstComponent, CounterComponent]);
