class TacticTasksController < ApplicationController
  before_action :set_tactic_task, only: [:show, :edit, :update, :destroy]

  # GET /tactic_tasks
  # GET /tactic_tasks.json
  def index
    @tactic_tasks = TacticTask.all
  end

  # GET /tactic_tasks/1
  # GET /tactic_tasks/1.json
  def show
  end

  # GET /tactic_tasks/new
  def new
    @tactic_task = TacticTask.new
  end

  # GET /tactic_tasks/1/edit
  def edit
  end

  # POST /tactic_tasks
  # POST /tactic_tasks.json
  def create
    @tactic_task = TacticTask.new(tactic_task_params)
    respond_to do |format|
      if @tactic_task.save
        format.any { render json: {msg: "创建成功!",success: true,data: @tactic_task }}
      else
        format.any { render json: {msg: "创建失败!",success: false},status: :unprocessable_entity}
      end
    end
  end

  # PATCH/PUT /tactic_tasks/1
  # PATCH/PUT /tactic_tasks/1.json
  def update
    respond_to do |format|
      if @tactic_task.update(tactic_task_params)
        format.any { render json: {msg: "更新成功!",success: true,data: @tactic_task }}
      else
        format.any { render json: {msg: "更新失败!",success: false},status: :unprocessable_entity}
      end
    end
  end

  # DELETE /tactic_tasks/1
  # DELETE /tactic_tasks/1.json
  def destroy
    @tactic_task.destroy
    respond_to do |format|
      format.html { redirect_to tactic_tasks_url, notice: 'Tactic task was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_tactic_task
      @tactic_task = TacticTask.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def tactic_task_params
      params.require(:tactic_task).permit(:name, :tactic_id, :category, :executor, :status, :finished_time, :start_time, :end_time, :description, :order)
    end
end