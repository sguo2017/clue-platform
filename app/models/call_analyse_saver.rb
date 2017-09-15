class CallAnalyseSaver < ApplicationRecord
  belongs_to :user

  COLUMNS_ON_EXTRA_TASK = {
    id: "ID",
    title: "标题",
    created_at: "创建时间",
  }
  EXECUTE_PATH = "/tools/home"
  SEARCH_KEY = :title

end
