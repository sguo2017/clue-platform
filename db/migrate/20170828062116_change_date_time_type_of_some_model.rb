class ChangeDateTimeTypeOfSomeModel < ActiveRecord::Migration[5.1]
  def up
    change_column :tactics, :start_time, :date
    change_column :tactics, :end_time, :date
    change_column :tactic_tasks, :start_time, :date
    change_column :tactic_tasks, :end_time, :date
    change_column :tactic_tasks, :finished_time, :date
  end

  def down
    change_column :tactics, :start_time, :datetime
    change_column :tactics, :end_time, :datetime
    change_column :tactic_tasks, :start_time, :datetime
    change_column :tactic_tasks, :end_time, :datetime
    change_column :tactic_tasks, :finished_time, :datetime
  end
end
