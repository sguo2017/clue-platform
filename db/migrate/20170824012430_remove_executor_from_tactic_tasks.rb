class RemoveExecutorFromTacticTasks < ActiveRecord::Migration[5.1]
  def change
    remove_column :tactic_tasks, :executor, :string
  end
end
