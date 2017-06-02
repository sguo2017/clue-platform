Rails.application.routes.draw do

  resources :calllists  do
    collection { post :import }
    collection { get :export }
  end

  resources :suspects
  get 'spa/react_framework7'
  get 'spa/react_adminonrest'
  get 'todomvc/angular'

  get 'todomvc/backbone'

  get 'todomvc/ember'

  get 'todomvc/knockout'

  get 'todomvc/react'

  get 'todomvc/vue'

  get 'spa/react-framework7'
  get 'spa/react-adminonrest'
  get 'spa/react-budgeting'

  get 'spa/angular-blur'
  get 'spa/angular-adminlte'

  get 'spa/vue-framework7'
  get 'spa/vue-admin'
  get 'spa/vue-cnodejs'
  get 'spa/vue-douban'
  get 'spa/vue-adminlte'
  get 'spa/hello-vue'

  get 'spa/backbone-todo'

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
