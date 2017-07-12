class SuspectsTeamsController < ApplicationController
  before_action :set_suspects_team, only: [:show, :edit, :update, :destroy]

  # GET /suspects_teams
  # GET /suspects_teams.json
  def index
    #@suspects_teams = SuspectsTeam.all
  end

  # GET /suspects_teams/1
  # GET /suspects_teams/1.json
  def show
  end

  # GET /suspects_teams/new
  def new
    @suspects_team = SuspectsTeam.new
  end

  # GET /suspects_teams/1/edit
  def edit
  end

  # POST /suspects_teams
  # POST /suspects_teams.json
  def create
    @suspects_team = SuspectsTeam.new(suspects_team_params)

    respond_to do |format|
      if @suspects_team.save
        format.html { redirect_to @suspects_team, notice: 'Suspects team was successfully created.' }
        format.json { render :show, status: :created, location: @suspects_team }
      else
        format.html { render :new }
        format.json { render json: @suspects_team.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /suspects_teams/1
  # PATCH/PUT /suspects_teams/1.json
  def update
    respond_to do |format|
      if @suspects_team.update(suspects_team_params)
        format.html { redirect_to @suspects_team, notice: 'Suspects team was successfully updated.' }
        format.json { render :show, status: :ok, location: @suspects_team }
      else
        format.html { render :edit }
        format.json { render json: @suspects_team.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /suspects_teams/1
  # DELETE /suspects_teams/1.json
  def destroy
    @suspects_team.destroy
    respond_to do |format|
      format.html { redirect_to suspects_teams_url, notice: 'Suspects team was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_suspects_team
      #@suspects_team = SuspectsTeam.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def suspects_team_params
      params.require(:suspects_team).permit(:name, :catalog, :company, :addr, :account, :photo)
    end
end
