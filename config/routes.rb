Rails.application.routes.draw do

  get 'spa/react_framework7'

  get 'spa/angular'

  get 'spa/vue_framework7'
  get 'spa/vue_admin'
  get 'spa/vue_cnodejs'
  get 'spa/vue_douban'
  get 'spa/vue_adminlte'
  get 'spa/vue_element'

  get 'excel/index'

  get 'suspects_teams/index'

  get 'tools/index'

  get 'suspects/index'

  root 'dashboard#index'

  devise_for :users, controllers: {
    sessions: 'users/sessions'
  }
  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
