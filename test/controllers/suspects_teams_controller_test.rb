require 'test_helper'

class SuspectsTeamsControllerTest < ActionDispatch::IntegrationTest
  setup do
    @suspects_team = suspects_teams(:one)
  end

  test "should get index" do
    get suspects_teams_url
    assert_response :success
  end

  test "should get new" do
    get new_suspects_team_url
    assert_response :success
  end

  test "should create suspects_team" do
    assert_difference('SuspectsTeam.count') do
      post suspects_teams_url, params: { suspects_team: { account: @suspects_team.account, addr: @suspects_team.addr, catalog: @suspects_team.catalog, company: @suspects_team.company, name: @suspects_team.name, photo: @suspects_team.photo } }
    end

    assert_redirected_to suspects_team_url(SuspectsTeam.last)
  end

  test "should show suspects_team" do
    get suspects_team_url(@suspects_team)
    assert_response :success
  end

  test "should get edit" do
    get edit_suspects_team_url(@suspects_team)
    assert_response :success
  end

  test "should update suspects_team" do
    patch suspects_team_url(@suspects_team), params: { suspects_team: { account: @suspects_team.account, addr: @suspects_team.addr, catalog: @suspects_team.catalog, company: @suspects_team.company, name: @suspects_team.name, photo: @suspects_team.photo } }
    assert_redirected_to suspects_team_url(@suspects_team)
  end

  test "should destroy suspects_team" do
    assert_difference('SuspectsTeam.count', -1) do
      delete suspects_team_url(@suspects_team)
    end

    assert_redirected_to suspects_teams_url
  end
end
