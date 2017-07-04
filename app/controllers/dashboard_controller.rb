class DashboardController < ApplicationController
	before_action :access_entry

	 def index
	  	#@suspects = Suspect.all.order("created_at DESC").limit(6)  	
	 end

	def access_entry
		@user = current_user
		case @user.position
		when "decision"
		    puts "decision"
		    redirect_to position_decisions_index_path 
		else
		    puts "default"
		end
	end
end
