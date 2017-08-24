class TacticsController < ApplicationController
  before_action :set_tactic, only: [:show, :edit, :update, :destroy]

  # GET /tactics
  # GET /tactics.json
  def index
    classic = params["classic"]
    category = params["category"]
    if classic.present?
      @tactics = Tactic.where(:classic => classic.to_i)
    elsif category.present?
      @tactics = Tactic.where(:category => category)
    else
      @tactics = Tactic.all
    end
    @tactics = @tactics.order("created_at desc").page(params[:page]).per(8)
  end

  # GET /tactics/1
  # GET /tactics/1.json
  def show
  end

  #GET /tactics/1/get_tactic_tasks
  def get_tactic_tasks
    @tactic = Tactic.find(params[:tactic_id])
    headers = TacticTask.attribute_names*1
    headers.push("user")
    render :json => {
      :msg=>"获取成功！",
      :success => true,
      :data => {
        :headers => headers,
        :tasks => JSON.parse(@tactic.tactic_tasks.to_json(:include => :user))
      }
    }
  end

  #GET /tactics/1/persist_tasks
  def persist_tasks
    #无论是哪种情况，只要保存成功，那么返回的json数据中必须包含当前战法的所有任务的数组(response.data.tasks)
    #因为前端需要根据这个任务数组去刷新一次前端的任务列表，即使任务列表是空数组，前端也需要依赖这个数组去进行同步
    @tactic = Tactic.find(params[:tactic_id])
    created_ids = []
    tactic_tasks = params[:tactic_tasks]
    #当前端任务没有修改时，params[:tactic_tasks]参数为nil值，需要做特殊处理
    if tactic_tasks.blank?
      render json: {
        msg: "保存成功",
        success: true,
        data: {
          created_ids: [],
          tasks: JSON.parse(@tactic.tactic_tasks.to_json(:include => :user)),
          finished_task_count: @tactic.finished_task_count,
          unfinished_task_count: @tactic.unfinished_task_count
          }
        }
      return
    else
      tactic_tasks = tactic_tasks.values
    end
    begin
      TacticTask.transaction do
        tactic_tasks.each do |t|
          if t["_modify_"] == "updated"
            target = TacticTask.find(t["id"])
            target.update(tactic_task_params(t))
            # 更新用户执行者
            target.user.clear
            target.user<<(User.where(:id => t["user"].values.map{|x|x["id"]})) if t["user"].present?
          elsif t["_modify_"] == "created"
            created = TacticTask.create!(tactic_task_params(t))
            # 更新用户执行者
            created.user<<(User.where(:id => t["user"].values.map{|x|x["id"]})) if t["user"].present?
            created_ids.push({:guid => t["temp_guid"],:id => created.id})
          elsif t["_modify_"] == "deleted"
            TacticTask.find(t["id"]).delete
          end
        end
      end
    rescue
      logger.debug $!
      render json: {msg: "保存失败", success: false},status: :unprocessable_entity
      return
    end
    render json: {
      msg: "保存成功",
      success: true,
      data: {
        created_ids: created_ids,
        tasks: JSON.parse(@tactic.tactic_tasks.to_json(:include => :user)),
        finished_task_count: @tactic.finished_task_count,
        unfinished_task_count: @tactic.unfinished_task_count
        }
      }
  end

  #GET /tactics/1/progress
  def progress
    @tactic = Tactic.find(params[:tactic_id])
    fetcher = HTTPClient.new
    if @tactic.flow_data_url
      res = fetcher.get(@tactic.flow_data_url).content
      @go_model = JSON.parse(res)
      @go_model["nodeDataArray"].each do |node|
        if node["task_id"].present?
          task_id = node["task_id"]
          task = TacticTask.find(task_id)
          node["nodeColor"] = task.status == "已完成" ? "green" : "red"
        elsif node["category"].blank?
          node["nodeColor"] = "blue"
        end
      end
    end
    render :progress
  end


  # GET /tactics/new
  def new
    @tactic = Tactic.new
  end

  # GET /tactics/1/edit
  def edit
  end

  # POST /tactics
  # POST /tactics.json
  def create
    @tactic = Tactic.new(tactic_params)
    @tactic.cases<<Case.where(:id => params["tactic"]["cases"].split(','))
    respond_to do |format|
      if @tactic.save
        format.html { redirect_to @tactic, notice: '成功创建战法' }
        format.json { render :show, status: :created, location: @tactic }
      else
        format.html { render :new }
        format.json { render json: @tactic.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /tactics/1
  # PATCH/PUT /tactics/1.json
  def update
    respond_to do |format|
      if @tactic.update(tactic_params)
        format.html { redirect_to @tactic, notice: 'Tactic was successfully updated.' }
        format.json { render :show, status: :ok, location: @tactic }
      else
        format.html { render :edit }
        format.json { render json: @tactic.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /tactics/1
  # DELETE /tactics/1.json
  def destroy
    @tactic.destroy
    respond_to do |format|
      format.html { redirect_to tactics_url, notice: 'Tactic was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
  # Use callbacks to share common setup or constraints between actions.
  def set_tactic
    @tactic = Tactic.find(params[:id])
  end

  # Never trust parameters from the scary internet, only allow the white list through.
  def tactic_params
    params.require(:tactic).permit(:name, :created_by, :status,:category, :flow_image_url, :flow_data_url, :executive_team, :description, :start_time, :end_time, :classic)
  end

  def tactic_task_params(hash)
    white_list = [:name, :tactic_id, :category, :status, :finished_time, :start_time, :end_time, :description, :order]
    hash.select{ |k,v| white_list.include?(k.to_sym) }
  end
end
