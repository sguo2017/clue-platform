Rails.application.routes.draw do

  root 'dashboard#index'

  devise_for :users, controllers: {
    sessions: 'users/sessions'
  }

  resources :calllists  do
    collection do
      get :export
      post :read_from_excel
      post :save_from_json
      get :load_note_options
      get :load_date_options
      get :load_batch_options
    end
  end

  resources :call_analyse_savers do
    collection do
      get :default
    end
  end

  resources :cases do
    collection do
      get :search
    end
  end

  resources :dashboard

  resources :extra_tasks do
    member do
      get :jump_to_execute
      get :jump_to_show
      get :jump_to_bind
    end
  end

  resources :image_views, only: [:index]

  resources :position_decisions

  resources :resources do
    collection do
      get :search
    end
  end

  resources :suspects

  resources :suspects_teams

  resources :tactics do
    member do
      get :get_tactic_tasks
      post :persist_tasks
      get :progress
    end
  end

  resources :tactic_tasks

  resources :tools do
    collection do
      get :home
      get :add_info
      get :add_manual
      get :rlat
      get :rlat_details
    end
  end

  post 'users/search', to: 'users/users#search'

  # For details on the DSL available within this file, see http://guides.rubyonrails.org/routing.html
end
