require 'csv'
class Calllist < ApplicationRecord
  #从文件导入数据,如果文件中不包含from_num和to_num字段则不导入
  def self.import(file)
    csv_text = File.read(file.path)
    csv = CSV.parse(csv_text, :headers => true)
    headers = csv.headers
    if headers.index(:from_num)>=0 and headers.index(:to_num)>=0
      csv.each do |row|
          Calllist.create!(row.to_hash)
      end
    else
      false
    end
  end

  #从文件读取数据,不作处理直接返回json
  def self.read(file)
    csv_text = File.read(file.path)
    csv = CSV.parse(csv_text, :headers => true)
    return csv.map{|row| row.to_hash}
  end

end
