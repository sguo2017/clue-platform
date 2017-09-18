class ExtraTasksController < ApplicationController
  before_action :set_extra_task, only: [:update, :destroy]
  before_action :set_special_extra_task, only: [:jump_to_execute, :jump_to_show, :jump_to_bind]

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
        format.html { redirect_to edit_tactic_task_path(@extra_task.tactic_task), notice: '绑定成功' }
        format.json { render :show, status: :ok, location: @extra_task }
      else
        format.html { redirect_back(fallback_location: root_path) }
        format.json { render json: @extra_task.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /extra_tasks/1
  # DELETE /extra_tasks/1.json
  def destroy
    @extra_task.destroy
    respond_to do |format|
      format.html { redirect_to extra_tasks_url, notice: '删除成功' }
      format.json { head :no_content }
    end
  end

  def jump_to_execute
    path = @target_task_class::EXECUTE_PATH if @target_task_class.present?
    path.present? && (redirect_to path)
    path.blank? && redirect_back(fallback_location: root_path)
  end

  def jump_to_show
    target_task = nil
    if @target_task_class.present? && @extra_task.result_id.present?
      target_task = @target_task_class.find(@extra_task.result_id)
    end
    target_task.present? && (redirect_to target_task)
    target_task.blank? && redirect_back(fallback_location: root_path)
  end

  def jump_to_bind
    keyword = params[:keyword]
    key_column = @target_task_class::SEARCH_KEY
    if key_column.present? && keyword.present?
      @selections = @target_task_class
        .where("user_id = ? and #{key_column} like ? ", current_user.id, "%#{keyword}%")
        .order("created_at DESC").page(params[:page]).per(5)
    else
      @selections = @target_task_class.where(:user_id => current_user.id).order("created_at DESC")
        .page(params[:page]).per(5)
    end
    render :bind and return
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_extra_task
      @extra_task = ExtraTask.find(params[:id])
    end

    def set_special_extra_task
      @extra_task = ExtraTask.find(params[:id])
      @target_task_class = ExtraTask::TASK_MAP[@extra_task.name.to_sym]
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def extra_task_params
      params.require(:extra_task).permit(:name, :result_id, :tactic_task_id)
    end
end
