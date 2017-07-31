class CalllistsController < ApplicationController
  before_action :login_required, :only => [:index,:show,:new,:edit,:create]
  #protect_from_forgery :except => :export
  protect_from_forgery :except => :process_excel

  before_action :set_calllist, only: [:show, :edit, :update, :destroy]
  #skip_before_action :verify_authenticity_token

  #直接从数据库中导出calllist的数据(导出为{link:[{}...],node:[{}...]}的格式)
  #若没有指定batch(批次)参数,则导出全部
  def export
    if(params['batch']).present?
      origin = Calllist.where(:batch => params['batch'])
      lite = origin.select{|c| !c.from_num.nil? and !c.to_num.nil?}
                   .map{ |c| {:from_num => c.from_num, :to_num => c.to_num }}
    else
      origin = Calllist.all
      lite = origin.select{|c| !c.from_num.nil? and !c.to_num.nil?}
                   .map{ |c| {:from_num => c.from_num, :to_num => c.to_num }}
    end
    render :json => {:msg=>"calllist was successfully exported!",:success=>true,:data=>lite}
  end

  #从前端上传的excel文件中读取数据而不保存,并且按照原始的json格式返回({name1:value1,name2:value2,...})
  def read_from_excel
    data = Calllist.read(params[:file])
    render :json => {:msg => "file read successfully!",:success =>true,:data => data}
  end

  def save_from_json
    array = params[:data].values
    note = params[:note]
    batch =  current_user.id.to_s + Time.now.strftime('_%Y_%m_%d_') + Time.now.to_i.to_s
    if current_user
      Calllist.transaction do
        array.each do |row|
          row['batch'] = batch
          row['note'] = note
          Calllist.create!(row)
        end
      end
      render :json => {:msg =>"data saved successfully!",:success =>true,:batch => batch,:note => note}
    else
      render :json => {:msg =>"failed to get user info,you need to login!",:success =>false}
    end
  end

  # GET /calllists
  # GET /calllists.json
  def index
    @calllists = Calllist.all
  end

  # GET /calllists/1
  # GET /calllists/1.json
  def show
  end

  # GET /calllists/new
  def new
    @calllist = Calllist.new
  end

  # GET /calllists/1/edit
  def edit
  end

  # POST /calllists
  # POST /calllists.json
  def create
    @calllist = Calllist.new(calllist_params)

    respond_to do |format|
      if @calllist.save
        format.html { redirect_to @calllist, notice: 'Calllist was successfully created.' }
        format.json { render :show, status: :created, location: @calllist }
      else
        format.html { render :new }
        format.json { render json: @calllist.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /calllists/1
  # PATCH/PUT /calllists/1.json
  def update
    respond_to do |format|
      if @calllist.update(calllist_params)
        format.html { redirect_to @calllist, notice: 'Calllist was successfully updated.' }
        format.json { render :show, status: :ok, location: @calllist }
      else
        format.html { render :edit }
        format.json { render json: @calllist.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /calllists/1
  # DELETE /calllists/1.json
  def destroy
    @calllist.destroy
    respond_to do |format|
      format.html { redirect_to calllists_url, notice: 'Calllist was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_calllist
      @calllist = Calllist.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def calllist_params
      params.require(:calllist).permit(:from_num, :to_num)
    end
end
