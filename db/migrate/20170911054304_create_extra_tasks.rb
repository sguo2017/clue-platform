class CreateExtraTasks < ActiveRecord::Migration[5.1]
  def change
    create_table :extra_tasks do |t|
      t.string :name
      t.integer :result_id
      t.integer :tactic_task_id

      t.timestamps
    end
  end
end
