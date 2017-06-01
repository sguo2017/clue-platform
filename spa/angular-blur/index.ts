import './polyfills.ts';
import 'reflect-metadata';

import "roboto-fontface/css/roboto/roboto-fontface.css";
import "normalize.css/normalize.css";
import "font-awesome/css/font-awesome.css";
import "ionicons/css/ionicons.css";
import "bootstrap/dist/css/bootstrap.css";
import "leaflet/dist/leaflet.css";
import "chartist/dist/chartist.css";
import "fullcalendar/dist/fullcalendar.css";
import "handsontable/dist/handsontable.full.css";
import "ng2-slim-loading-bar/style.css";

import 'jquery';
import "easy-pie-chart";
import 'jquery-slimscroll';
import "tether";
import "bootstrap";
import "handsontable/dist/handsontable.full";
import "chroma-js";

import { enableProdMode } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from './app/app.module';

require('style-loader!css-loader!sass-loader!./app/theme/theme.scss');

platformBrowserDynamic().bootstrapModule(AppModule);
