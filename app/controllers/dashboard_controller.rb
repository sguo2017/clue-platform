class DashboardController < ApplicationController
	before_action :access_entry

	 def index
	  	#@suspects = Suspect.all.order("created_at DESC").limit(6)
	 end

	def access_entry
		redirect_to position_decisions_path
		# @user = current_user
		# case @user.position
		# when "decision"
		#     puts "decision"
		#     redirect_to position_decisions_path
		# else
		#     puts "default"
		# end
	end
end
