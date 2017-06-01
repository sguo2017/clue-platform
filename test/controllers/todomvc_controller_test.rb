require 'test_helper'

class TodomvcControllerTest < ActionDispatch::IntegrationTest
  test "should get angular" do
    get todomvc_angular_url
    assert_response :success
  end

  test "should get backbone" do
    get todomvc_backbone_url
    assert_response :success
  end

  test "should get ember" do
    get todomvc_ember_url
    assert_response :success
  end

  test "should get knockout" do
    get todomvc_knockout_url
    assert_response :success
  end

  test "should get react" do
    get todomvc_react_url
    assert_response :success
  end

  test "should get vue" do
    get todomvc_vue_url
    assert_response :success
  end

end
