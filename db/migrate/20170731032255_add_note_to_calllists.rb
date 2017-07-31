class AddNoteToCalllists < ActiveRecord::Migration[5.1]
  def change
    add_column :calllists, :note, :string
  end
end
