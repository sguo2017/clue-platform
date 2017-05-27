require 'test_helper'

class CalllistsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @calllist = calllists(:one)
  end

  test "should get index" do
    get calllists_url
    assert_response :success
  end

  test "should get new" do
    get new_calllist_url
    assert_response :success
  end

  test "should create calllist" do
    assert_difference('Calllist.count') do
      post calllists_url, params: { calllist: { from_num: @calllist.from_num, to_num: @calllist.to_num } }
    end

    assert_redirected_to calllist_url(Calllist.last)
  end

  test "should show calllist" do
    get calllist_url(@calllist)
    assert_response :success
  end

  test "should get edit" do
    get edit_calllist_url(@calllist)
    assert_response :success
  end

  test "should update calllist" do
    patch calllist_url(@calllist), params: { calllist: { from_num: @calllist.from_num, to_num: @calllist.to_num } }
    assert_redirected_to calllist_url(@calllist)
  end

  test "should destroy calllist" do
    assert_difference('Calllist.count', -1) do
      delete calllist_url(@calllist)
    end

    assert_redirected_to calllists_url
  end
end
