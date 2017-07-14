require 'csv'
class Calllist < ApplicationRecord
  def self.import(file)
    csv_text = File.read(file.path)
    csv = CSV.parse(csv_text, :headers => true)
    csv.each do |row|
      Calllist.create!(row.to_hash)
    end
  end

  def self.read(file)
    csv_text = File.read(file.path)
    csv = CSV.parse(csv_text, :headers => true)
    calllist = []
    csv.each do |row|
      calllist.push(Calllist.new(row.to_hash))
    end
    return calllist
  end

end
