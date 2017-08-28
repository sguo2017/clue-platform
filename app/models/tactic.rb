class Tactic < ApplicationRecord
  has_and_belongs_to_many :cases
  has_many :tactic_tasks ,dependent:  :destroy

  def finished_task_count
    return self.tactic_tasks.where(:status => "已完成").size
  end

  def unfinished_task_count
    return self.tactic_tasks.where.not(:status => "已完成").size
  end

  def has_finish?
    return self.status == "已完成" && self.unfinished_task_count == 0
  end
end
