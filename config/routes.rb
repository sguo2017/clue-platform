Rails.application.routes.draw do

  resources :tactic_tasks
  resources :tactics do
    get "get_tactic_tasks"
  end
  resources :cases
  resources :suspects_teams
  resources :calllists  do
    collection { get :export }
    collection { post :read_from_excel }
    collection { post :save_from_json }
    collection { get :load_note_options }
    collection { get :load_date_options }
    collection { get :load_batch_options }
  end
  resources :call_analyse_savers do
    collection {get :default}
  end



  get 'excel/index'

  #get 'suspects_teams/index'

  get 'tools/index'

  get 'suspects', to: 'suspects#index'
  get 'suspects/:id',  to: 'suspects#show'

  get 'position_decisions/index'

  get 'resources/search', to: 'resources#search'

  get 'tactics', to: 'tactics#index'
  get '/tactics/:id', to: 'tactics#show'
  get '/tools/home', to: 'tools#home'
  get '/tools/add_info', to: 'tools#add_info'
  get '/tools/add_manual', to: 'tools#add_manual'
  get '/tools/rlat', to: 'tools#rlat'
  get '/tools/rlat_details', to: 'tools#rlat_details'

  get '/cases/:id', to: 'cases#show'


  root 'dashboard#index'

  devise_for :users, controllers: {
    sessions: 'users/sessions'
  }


  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
