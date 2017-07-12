class CreateCases < ActiveRecord::Migration[5.1]
  def change
    create_table :cases do |t|
      t.string :name
      t.string :catalog
      t.string :role
      t.string :status
      t.string :detail
      t.string :photo

      t.timestamps
    end
  end
end
