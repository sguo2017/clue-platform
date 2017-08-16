class RemoveCaseIdFromTactics < ActiveRecord::Migration[5.1]
  def change
    remove_column :tactics, :case_id, :integer
  end
end
