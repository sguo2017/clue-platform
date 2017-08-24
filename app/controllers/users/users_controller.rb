class Users::UsersController < ApplicationController

  def search
    name = params["name"]
    result = User.where("name like ?" , "%#{name}%")
    render :json => {:msg => "搜索成功", :success => true, :data => result}
  end

end
