class CreateCallAnalyseSaver < ActiveRecord::Migration[5.1]
  def change
    create_table :call_analyse_savers do |t|
      t.string :title
      t.integer :user_id
      t.string :image_url
      t.string :data_url

      t.timestamps
    end
  end
end
