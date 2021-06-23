import Aurelia, { /*, StyleConfiguration*/ } from 'aurelia';
import { MyApp } from './my-app';
// import shared from './shared.scss';

Aurelia
  /*
  .register(StyleConfiguration.shadowDOM({
    // optionally add the shared styles for all components
    sharedStyles: [shared]
  }))
  */
  .app(MyApp)
  .start();
