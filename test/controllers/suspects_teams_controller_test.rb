require 'test_helper'

class SuspectsTeamsControllerTest < ActionDispatch::IntegrationTest
  test "should get index" do
    get suspects_teams_index_url
    assert_response :success
  end

end
