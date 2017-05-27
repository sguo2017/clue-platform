equire 'csv'
class Calllist < ApplicationRecord
  def self.import(file)
    csv_text = File.read(file.path)
    csv = CSV.parse(csv_text, :headers => true)
    csv.each do |row|
      Calllist.create!(row.to_hash)
    end
  end

end
