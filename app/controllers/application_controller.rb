class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
<<<<<<< HEAD
  before_action :authenticate_user!,except: [:import]
=======
  before_action :authenticate_user!
>>>>>>> cc38c56cee565ae575ec92a60c5f09698174fcef
end
