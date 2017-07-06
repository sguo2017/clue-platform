Rails.application.routes.draw do

  resources :calllists  do
    collection { post :import }
    collection { get :export }
  end

 # resources :suspects
  get 'spa/react_framework7'
  get 'spa/react_adminonrest'

  get 'spa/angular_blur'
  get 'spa/angular_adminlte'

  get 'spa/vue_framework7'
  get 'spa/vue_admin'
  get 'spa/vue_cnodejs'
  get 'spa/vue_douban'
  get 'spa/vue_adminlte'

  get 'spa/backbone-todo'

  get 'excel/index'

  get 'suspects_teams/index'

  get 'tools/index'

  get 'suspects/index'

  get 'position_decisions/index'

  get 'resources/search', to: 'resources#search'


  root 'dashboard#index'

  devise_for :users, controllers: {
    sessions: 'users/sessions'
  }


  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
