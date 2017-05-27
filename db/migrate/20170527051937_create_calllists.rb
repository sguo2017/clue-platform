class CreateCalllists < ActiveRecord::Migration[5.1]
  def change
    create_table :calllists do |t|
      t.string :from_num
      t.string :to_num

      t.timestamps
    end
  end
end
