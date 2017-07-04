require 'test_helper'

class PositionDecisionsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @position_decision = position_decisions(:one)
  end

  test "should get index" do
    get position_decisions_url
    assert_response :success
  end

  test "should get new" do
    get new_position_decision_url
    assert_response :success
  end

  test "should create position_decision" do
    assert_difference('PositionDecision.count') do
      post position_decisions_url, params: { position_decision: {  } }
    end

    assert_redirected_to position_decision_url(PositionDecision.last)
  end

  test "should show position_decision" do
    get position_decision_url(@position_decision)
    assert_response :success
  end

  test "should get edit" do
    get edit_position_decision_url(@position_decision)
    assert_response :success
  end

  test "should update position_decision" do
    patch position_decision_url(@position_decision), params: { position_decision: {  } }
    assert_redirected_to position_decision_url(@position_decision)
  end

  test "should destroy position_decision" do
    assert_difference('PositionDecision.count', -1) do
      delete position_decision_url(@position_decision)
    end

    assert_redirected_to position_decisions_url
  end
end
