class AddBatchToCalllists < ActiveRecord::Migration[5.1]
  def change
    add_column :calllists, :batch, :string
  end
end
