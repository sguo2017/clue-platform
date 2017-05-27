class DashboardController < ApplicationController
  def index
  	@suspects = Suspect.all.order("created_at DESC").limit(6)  	
  end
end
