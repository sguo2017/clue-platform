require 'test_helper'

class SuspectsControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get suspects_index_url
    assert_response :success
  end

end
