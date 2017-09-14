class TacticTask < ApplicationRecord
  belongs_to :tactic
  has_and_belongs_to_many :user
  has_one :extra_task, dependent: :destroy

  after_create :create_extra_task

  LIST_OF_EXTRA_TASK = ["话单分析"]

  def should_do_extra_task
    return self.extra_task.present?
  end

  private
    def create_extra_task
      if LIST_OF_EXTRA_TASK.include?(self.category)
        self.create_extra_task!(:name => self.category)
      end
    end
end
