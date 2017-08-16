class AddCategoryToTactics < ActiveRecord::Migration[5.1]
  def change
    add_column :tactics, :category, :string
  end
end
