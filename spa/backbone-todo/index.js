'use strict';

//ES6 import
import config from './config';
import $ from 'jquery';
import _ from 'lodash';
import Backbone from 'backbone';
import Router from './router';
import Bootstrap from '../../public/assets/bootstrap/dist/js/bootstrap.min';

//third-party libs
import '../../public/assets/bootstrap/dist/css/bootstrap.min.css';
import 'animate.css/animate.min.css';

//app.scss
import './assets/sass/app.scss';


// Instatiate Backbone router
var AppRouter = new Router();

Backbone.history.start();
