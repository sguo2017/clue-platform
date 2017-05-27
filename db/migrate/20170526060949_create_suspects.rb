class CreateSuspects < ActiveRecord::Migration[5.1]
  def change
    create_table :suspects do |t|
      t.string :name
      t.string :userName
      t.string :realName
      t.string :email
      t.string :born
      t.datetime :dob
      t.string :photo
      t.string :status
      t.string :skills
      t.string :settings

      t.timestamps
    end
  end
end
