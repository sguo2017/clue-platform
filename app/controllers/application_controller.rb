class ApplicationController < ActionController::Base
  protect_from_forgery with: :exception
  before_action :authenticate_user!
  before_action :menu_active
  def menu_active
    unless session[:curr_position].blank?
          current_user.position = session[:curr_position]
    end  
    @user = current_user
    @current_uri = request.fullpath
    #puts "@current_uri=" + @current_uri
    @current_nav = @current_uri[/^\/([a-z_]+)[\?\/]{0,1}.*/,1].to_s
    #puts "@current_nav=" + @current_nav
     if @current_nav.blank?
     	@current_nav = "position_decisions"
    #     logger.debug "error! current_nav is blank!!!"
    # else
    #     logger.debug "@current_nav  #{@current_nav}"
     end
    @home_menu = ["position_decisions"]
    @resources_menu = ["resources"]
    @tactics = ["tactics"]
    @tools = ["tools"]
    if @home_menu.include?(@current_nav)
        @current_nav = "home"
    elsif @resources_menu.include?(@current_nav)
        @current_nav = "resources"
    elsif @tactics.include?(@current_nav)
        @current_nav = "tactics"
    elsif @tools.include?(@tools)
        @current_nav = "tools"
    end
  end
end
