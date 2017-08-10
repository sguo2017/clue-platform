class CreateTacticTasks < ActiveRecord::Migration[5.1]
  def change
    create_table :tactic_tasks do |t|
      t.string :name
      t.integer :tactic_id
      t.string :category
      t.string :executor
      t.string :status
      t.timestamp :finished_time
      t.timestamp :start_time
      t.timestamp :end_time
      t.text :description
      t.string :order

      t.timestamps
    end
  end
end
