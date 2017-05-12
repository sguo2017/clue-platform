require 'test_helper'

class ExcelControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get excel_index_url
    assert_response :success
  end

end
