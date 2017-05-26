import './polyfills.ts';
import 'reflect-metadata';

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

require('style-loader!css-loader!sass-loader!./app/theme/theme.scss');

platformBrowserDynamic().bootstrapModule(AppModule);
