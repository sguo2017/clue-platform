class PositionDecisionsController < ApplicationController
  before_action :set_position_decision, only: [:show, :edit, :update, :destroy]

  # GET /position_decisions
  # GET /position_decisions.json
  def index
    #@position_decisions = PositionDecision.all
    @user = current_user
    @user.position = "analysis"
    @suspects = Suspect.all
     #@user.position = "decision"
     #@user.position = "action"
  end

  # GET /position_decisions/1
  # GET /position_decisions/1.json
  def show
  end

  # GET /position_decisions/new
  def new
    @position_decision = PositionDecision.new
  end

  # GET /position_decisions/1/edit
  def edit
  end

  # POST /position_decisions
  # POST /position_decisions.json
  def create
    @position_decision = PositionDecision.new(position_decision_params)

    respond_to do |format|
      if @position_decision.save
        format.html { redirect_to @position_decision, notice: 'Position decision was successfully created.' }
        format.json { render :show, status: :created, location: @position_decision }
      else
        format.html { render :new }
        format.json { render json: @position_decision.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /position_decisions/1
  # PATCH/PUT /position_decisions/1.json
  def update
    respond_to do |format|
      if @position_decision.update(position_decision_params)
        format.html { redirect_to @position_decision, notice: 'Position decision was successfully updated.' }
        format.json { render :show, status: :ok, location: @position_decision }
      else
        format.html { render :edit }
        format.json { render json: @position_decision.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /position_decisions/1
  # DELETE /position_decisions/1.json
  def destroy
    @position_decision.destroy
    respond_to do |format|
      format.html { redirect_to position_decisions_url, notice: 'Position decision was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_position_decision
      @position_decision = PositionDecision.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def position_decision_params
      params.fetch(:position_decision, {})
    end
end
