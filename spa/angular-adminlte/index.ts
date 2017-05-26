import './polyfills.ts';

import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { enableProdMode } from '@angular/core';
import { environment } from './environments/environment';
import { AppModule } from './app/app.module';

import "../../public/assets/bootstrap/dist/css/bootstrap.css";
import "font-awesome/css/font-awesome.css";
import "admin-lte/dist/css/AdminLTE.css";
import "admin-lte/dist/css/skins/skin-blue.css";
import "ionicons/css/ionicons.css";
import "angular2-toaster/src/toaster.css";
import "./styles.less";

import 'jquery';
import '../../public/assets/bootstrap/dist/js/bootstrap.js';

if (environment.production) {
  enableProdMode();
}

platformBrowserDynamic().bootstrapModule(AppModule);
