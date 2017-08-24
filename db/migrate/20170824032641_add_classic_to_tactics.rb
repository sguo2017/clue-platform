class AddClassicToTactics < ActiveRecord::Migration[5.1]
  def change
    add_column :tactics, :classic, :boolean, default: false
  end
end
