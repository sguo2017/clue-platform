require 'test_helper'

class TacticCoversControllerTest < ActionDispatch::IntegrationTest
  setup do
    @tactic_cover = tactic_covers(:one)
  end

  test "should get index" do
    get tactic_covers_url
    assert_response :success
  end

  test "should get new" do
    get new_tactic_cover_url
    assert_response :success
  end

  test "should create tactic_cover" do
    assert_difference('TacticCover.count') do
      post tactic_covers_url, params: { tactic_cover: { category: @tactic_cover.category, tactic_id: @tactic_cover.tactic_id, url: @tactic_cover.url } }
    end

    assert_redirected_to tactic_cover_url(TacticCover.last)
  end

  test "should show tactic_cover" do
    get tactic_cover_url(@tactic_cover)
    assert_response :success
  end

  test "should get edit" do
    get edit_tactic_cover_url(@tactic_cover)
    assert_response :success
  end

  test "should update tactic_cover" do
    patch tactic_cover_url(@tactic_cover), params: { tactic_cover: { category: @tactic_cover.category, tactic_id: @tactic_cover.tactic_id, url: @tactic_cover.url } }
    assert_redirected_to tactic_cover_url(@tactic_cover)
  end

  test "should destroy tactic_cover" do
    assert_difference('TacticCover.count', -1) do
      delete tactic_cover_url(@tactic_cover)
    end

    assert_redirected_to tactic_covers_url
  end
end
