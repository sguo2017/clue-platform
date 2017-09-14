class ExtraTask < ApplicationRecord
  belongs_to :tactic_task

  TASK_MAP = {
    "话单分析": CallAnalyseSaver
  }
end
