class AddAttachmentToTacticTask < ActiveRecord::Migration[5.1]
  def change
    add_column :tactic_tasks, :attachment_url, :string
    add_column :tactic_tasks, :attachment_name, :string
  end
end
