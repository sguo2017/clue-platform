require 'test_helper'

class SpaControllerTest < ActionDispatch::IntegrationTest
  test "should get angular" do
    get spa_angular_url
    assert_response :success
  end

  test "should get vue" do
    get spa_vue_url
    assert_response :success
  end

  test "should get react" do
    get spa_react_url
    assert_response :success
  end

end
