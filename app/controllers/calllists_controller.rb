class CalllistsController < ApplicationController
  before_action :login_required, :only => [:index,:show,:new,:edit,:create]
  #protect_from_forgery :except => :import
  #protect_from_forgery :except => :export
  protect_from_forgery :except => :process_excel

  before_action :set_calllist, only: [:show, :edit, :update, :destroy]
  #skip_before_action :verify_authenticity_token

  def export
    formatted = gojs_format(Calllist.all)
    render :json => formatted
  end

  def import
   @retdata = Calllist.import(params[:file])
    respond_to do |format|
      format.json{
        render :json => {:msg => "csv file was successfully imported!", :data=>@retdata}.to_json
      }
    end
  end

  def process_excel
    list_from_ecxel = Calllist.read(params[:excel_call_list])
    formatted = gojs_format(list_from_ecxel)
    render :json => formatted
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

    def gojs_format(calllist)
      links = calllist.select{|c| !c.from_num.nil? and !c.to_num.nil?}.map{ |c| {:from_num => c.from_num, :to_num => c.to_num }}
      nodes = Set.new
      links.each do |l|
        nodes.add(l[:from_num])
        nodes.add(l[:to_num])
      end
      return {:nodes => nodes,:links => links}
    end
end
