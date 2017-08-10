class CreateTactics < ActiveRecord::Migration[5.1]
  def change
    create_table :tactics do |t|
      t.string :name
      t.integer :case_id
      t.integer :created_by
      t.string :status
      t.string :flow_image_url
      t.string :flow_data_url
      t.string :executive_team
      t.text :description
      t.timestamp :start_time
      t.timestamp :end_time

      t.timestamps
    end
  end
end
