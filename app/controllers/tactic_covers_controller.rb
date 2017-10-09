class TacticCoversController < ApplicationController
  before_action :set_tactic_cover, only: [:show, :edit, :update, :destroy]

  # GET /tactic_covers
  # GET /tactic_covers.json
  def index
    @tactic_covers = TacticCover.all
  end

  # GET /tactic_covers/1
  # GET /tactic_covers/1.json
  def show
  end

  # GET /tactic_covers/new
  def new
    @tactic_cover = TacticCover.new
  end

  # GET /tactic_covers/1/edit
  def edit
  end

  # POST /tactic_covers
  # POST /tactic_covers.json
  def create
    @tactic_cover = TacticCover.new(tactic_cover_params)

    respond_to do |format|
      if @tactic_cover.save
        format.html { redirect_to @tactic_cover, notice: 'Tactic cover was successfully created.' }
        format.json { render :show, status: :created, location: @tactic_cover }
      else
        format.html { render :new }
        format.json { render json: @tactic_cover.errors, status: :unprocessable_entity }
      end
    end
  end

  # PATCH/PUT /tactic_covers/1
  # PATCH/PUT /tactic_covers/1.json
  def update
    respond_to do |format|
      if @tactic_cover.update(tactic_cover_params)
        format.html { redirect_to @tactic_cover, notice: 'Tactic cover was successfully updated.' }
        format.json { render :show, status: :ok, location: @tactic_cover }
      else
        format.html { render :edit }
        format.json { render json: @tactic_cover.errors, status: :unprocessable_entity }
      end
    end
  end

  # DELETE /tactic_covers/1
  # DELETE /tactic_covers/1.json
  def destroy
    @tactic_cover.destroy
    respond_to do |format|
      format.html { redirect_to tactic_covers_url, notice: 'Tactic cover was successfully destroyed.' }
      format.json { head :no_content }
    end
  end

  private
    # Use callbacks to share common setup or constraints between actions.
    def set_tactic_cover
      @tactic_cover = TacticCover.find(params[:id])
    end

    # Never trust parameters from the scary internet, only allow the white list through.
    def tactic_cover_params
      params.require(:tactic_cover).permit(:tactic_id, :category, :url)
    end
end
