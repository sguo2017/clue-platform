require 'roo'

class Calllist < ApplicationRecord

  #从文件读取数据,不作处理直接返回json
  def self.read(file)
    spread_sheets = Roo::Spreadsheet.open(file)
    sheets_names = spread_sheets.sheets
    sheets = sheets_names.map{|name| {:name=>name,:rows => spread_sheets.sheet(name).map{|rows| rows}}}
    #[{:name=>"name",:rows=>[[row]...],[],[]]
    return sheets
  end

end
