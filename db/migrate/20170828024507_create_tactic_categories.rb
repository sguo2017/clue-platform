class CreateTacticCategories < ActiveRecord::Migration[5.1]
  def change
    create_table :tactic_categories do |t|
      t.string :name

      t.timestamps
    end
    add_index :tactic_categories, :name, unique: true
  end
end
