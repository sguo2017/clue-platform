require 'test_helper'

class TacticsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @tactic = tactics(:one)
  end

  test "should get index" do
    get tactics_url
    assert_response :success
  end

  test "should get new" do
    get new_tactic_url
    assert_response :success
  end

  test "should create tactic" do
    assert_difference('Tactic.count') do
      post tactics_url, params: { tactic: {  } }
    end

    assert_redirected_to tactic_url(Tactic.last)
  end

  test "should show tactic" do
    get tactic_url(@tactic)
    assert_response :success
  end

  test "should get edit" do
    get edit_tactic_url(@tactic)
    assert_response :success
  end

  test "should update tactic" do
    patch tactic_url(@tactic), params: { tactic: {  } }
    assert_redirected_to tactic_url(@tactic)
  end

  test "should destroy tactic" do
    assert_difference('Tactic.count', -1) do
      delete tactic_url(@tactic)
    end

    assert_redirected_to tactics_url
  end
end
