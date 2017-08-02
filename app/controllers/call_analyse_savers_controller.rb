class CallAnalyseSaversController < ApplicationController

  protect_from_forgery :except => :create

  before_action :set_cas, :only => [:show, :update, :destroy]

  # POST
  def create
    @cas = CallAnalyseSaver.new(cas_params)
    @cas.user = current_user
    if @cas.title.blank?
      @cas.title =  Time.now.strftime('%Y-%m-%d %H:%M')
    end
    respond_to do |format|
      if @cas.save
        format.any { render :json => {:msg => "保存成功" ,:success => true}}
      else
        format.any { render :json => {:msg => "保存失败" ,:success => false}}
      end
    end
  end

  #PATCH/PUT
  def update
    respond_to do |format|
      if @cas.update(cas_params)
        format.html { redirect_to tools_home_path, notice: '更新成功！' }
        format.json { render :json =>{ :msg => "更新成功！",:success => true, :data => @cas}}
      else
        format.html { redirect_to tools_home_path, notice: '更新失败！' }
        format.json { render :json =>{ :msg => "更新失败！",:success => false}}
      end
    end

  end

  #GET
  def show
    render :json => @cas
  end

  def index
    @cas_of_user = CallAnalyseSaver.where(:user_id=>current_user.id).order("created_at desc")
  end

  #DELETE
  def destroy
    @cas.destroy
    respond_to do |format|
      format.html { redirect_to tools_home_path, notice: '删除成功' }
      format.json { render :json => {:msg => "删除成功！",:success => true, :data => @cas} }
    end
  end

  def default
    first = CallAnalyseSaver.where(:user_id => current_user.id).order("created_at desc").first()
    render :json => first
  end

  private
    # Never trust parameters from the scary internet, only allow the white list through.
    def cas_params
      params.require(:call_analyse_saver).permit(:data_url, :image_url,:title)
    end

    def set_cas
      @cas = CallAnalyseSaver.find(params[:id])
    end
end
