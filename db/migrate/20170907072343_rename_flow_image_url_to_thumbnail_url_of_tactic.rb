class RenameFlowImageUrlToThumbnailUrlOfTactic < ActiveRecord::Migration[5.1]
  def change
    rename_column :tactics, :flow_image_url, :thumbnail_url
  end
end
