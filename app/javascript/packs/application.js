/* eslint no-console:0 */
// This file is automatically compiled by Webpack, along with any other files
// present in this directory. You're encouraged to place your actual application logic in
// a relevant structure within app/javascript and only use these pack files to reference
// that code so it'll be compiled.
//
// To reference this file, add <%= javascript_pack_tag 'application' %> to the appropriate
// layout file, like app/views/layouts/application.html.erb
// import 'babel-polyfill'
import 'jquery-ujs'
import 'bootstrap'
import './extensions/active_vue_plugins'
import '../../../vendor/assets/plugins/jquery-labelauty.js'
import './extensions/js_extend'
import './extensions/go_extend'
import './controllers/call_analyse_savers_index'
import './controllers/call_analyse_savers_show'
import './controllers/tactic_tasks_edit'
import './controllers/tactics_form'
import './controllers/tactics_index'
import './controllers/tactics_progress'
import './controllers/tactics_show'
import './controllers/tools_add_info'
import './controllers/tools_add_manual'
import './controllers/tools_home'
import './controllers/tools_index'
import './controllers/image_views/index/app'
var Turbolinks = require('turbolinks')
Turbolinks.start()
$(document).on('turbolinks:load', function () {

})
