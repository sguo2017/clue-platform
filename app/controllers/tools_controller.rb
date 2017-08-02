class ToolsController < ApplicationController

  def index
  end
  #首页
  def home
    @tools_type = "home"
    @cas_of_user=CallAnalyseSaver.where(:user_id=>current_user.id).order("created_at desc").limit(6)
  end
  #新增情报资料库
  def add_info
    @tools_type = "home"
  end
  #手工导入
  def add_manual
    @tools_type = "home"
  end
  #人际交往关系
  def rlat
    @tools_type = "rlat"
  end
  #人际交往关系详细
  def rlat_details
    @tools_type = "rlat"
  end
end
