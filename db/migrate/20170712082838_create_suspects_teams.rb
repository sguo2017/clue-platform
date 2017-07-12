class CreateSuspectsTeams < ActiveRecord::Migration[5.1]
  def change
    create_table :suspects_teams do |t|
      t.string :name
      t.string :catalog
      t.string :company
      t.string :addr
      t.string :account
      t.string :photo

      t.timestamps
    end
  end
end
