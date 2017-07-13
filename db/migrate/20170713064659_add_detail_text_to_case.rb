class AddDetailTextToCase < ActiveRecord::Migration[5.1]
  def change
  	  change_column :cases, :detail, :text
  end
end
