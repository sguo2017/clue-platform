// Import F7
import Framework7 from 'framework7';

// Import F7 iOS Theme Styles
import 'framework7/dist/css/framework7.ios.min.css';
import 'framework7/dist/css/framework7.ios.colors.min.css';
// OR for Material Theme:
//import 'framework7/dist/css/framework7.material.min.css'
//import 'framework7/dist/css/framework7.material.colors.min.css'

import {render} from 'react-dom';
import * as React from 'react';

import {App} from './components/App';

render(React.createElement(App), document.getElementById('react-root'));