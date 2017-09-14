class ExtraTask < ApplicationRecord
  belongs_to :tactic_task


  def execute_path
    case self.name
    when "话单分析"
      "/tools/add_info"
    end
  end

  def show_path
    case self.name
    when "话单分析"
      "/call_analyse_savers/show/#{self.result_id}"
    end
  end
end
