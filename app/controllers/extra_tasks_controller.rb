class ExtraTasksController < ApplicationController
  before_action :set_extra_task, only: [:update, :destroy]
  before_action :set_special_extra_task, only: [:jump_to_execute, :jump_to_execute, :jump_to_execute]

  # POST /extra_tasks
  # POST /extra_tasks.json
  def create
    @extra_task = ExtraTask.new(extra_task_params)

    respond_to do |format|
      if @extra_task.save
        format.html { redirect_to @extra_task, notice: 'Extra task was successfully created.' }
        format.json { render :show, status: :created, location: @extra_task }
      else
        format.html { render :new }
        format.json { render json: @extra_task.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /extra_tasks/1
  # PATCH/PUT /extra_tasks/1.json
  def update
    respond_to do |format|
      if @extra_task.update(extra_task_params)
        format.html { redirect_to @extra_task, notice: 'Extra task was successfully updated.' }
        format.json { render :show, status: :ok, location: @extra_task }
      else
        format.html { render :edit }
        format.json { render json: @extra_task.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /extra_tasks/1
  # DELETE /extra_tasks/1.json
  def destroy
    @extra_task.destroy
    respond_to do |format|
      format.html { redirect_to extra_tasks_url, notice: 'Extra task was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  def jump_to_execute
    path = @extra_task.execute_path
    path.present? && (redirect_to path)
    path.blank? && redirect_back(fallback_location: root_path)
  end

  def jump_to_show
    path = @extra_task.show_path
    path.present? && (redirect_to path)
    path.blank? && redirect_back(fallback_location: root_path)
  end

  def jump_to_bind

    render :bind and return
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_extra_task
      @extra_task = ExtraTask.find(params[:id])
    end

    def set_special_extra_task
      @extra_task = ExtraTask.find(params[:extra_task_id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def extra_task_params
      params.require(:extra_task).permit(:name, :result_id, :tactic_task_id)
    end
end
