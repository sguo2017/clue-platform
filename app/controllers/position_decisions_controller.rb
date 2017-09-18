class PositionDecisionsController < ApplicationController

  # GET /position_decisions
  # GET /position_decisions.json
  def index
    #@position_decisions = PositionDecision.all
    session[:curr_position] = nil
    @user = current_user
    unless params[:position].blank?
      @user.position = params[:position]
    end
    session[:curr_position] = @user.position
    @suspects = Suspect.all.order("created_at DESC").limit(8)
    @suspects_teams = SuspectsTeam.all.order("created_at DESC").limit(6)
    @cases = Case.all.order("created_at DESC").limit(4)
    if @user.position == "action" #执行岗
      tasks = current_user.tactic_task.order("created_at DESC").to_a
      @finished_task = tasks.select{|x| x.status == "已完成"}
      @unfinished_task = tasks.select{|x| x.status != "已完成"}
    end
    #@user.position = "decision"
    #@user.position = "action"
  end
  
end
