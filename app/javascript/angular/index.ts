// Run this Angular example by adding the following HTML markup to your view:
//
// <hello-angular>Loading...</hello-angular>
//
// <%= javascript_pack_tag 'hello_angular' %>

import './polyfills.ts';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';

platformBrowserDynamic().bootstrapModule(AppModule);
