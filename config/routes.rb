Rails.application.routes.draw do

  get 'spa/vue'

  get 'spa/react'

  get 'spa/angular'

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
