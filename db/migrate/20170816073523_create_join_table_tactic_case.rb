class CreateJoinTableTacticCase < ActiveRecord::Migration[5.1]
  def change
    create_join_table :tactics, :cases do |t|
      t.index [:tactic_id, :case_id]
      t.index [:case_id, :tactic_id]
    end
  end
end
