class CreateJoinTableUserTacticTask < ActiveRecord::Migration[5.1]
  def change
    create_join_table :users, :tactic_tasks do |t|
      t.index [:user_id, :tactic_task_id]
      t.index [:tactic_task_id, :user_id]
    end
  end
end
