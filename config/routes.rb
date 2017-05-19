Rails.application.routes.draw do

  get 'spa/elm'

  get 'spa/vue'

  get 'spa/react'

  get 'spa/angular'

  get 'spa/framework7'

  get 'spa/vue_admin'
  get 'spa/vue_cnodejs'
  get 'spa/vue_douban'

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
