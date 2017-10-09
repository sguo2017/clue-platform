class CreateTacticCovers < ActiveRecord::Migration[5.1]
  def change
    create_table :tactic_covers do |t|
      t.integer :tactic_id
      t.string :category
      t.text :url

      t.timestamps
    end
  end
end
