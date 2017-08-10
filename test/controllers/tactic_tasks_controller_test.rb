require 'test_helper'

class TacticTasksControllerTest < ActionDispatch::IntegrationTest
  setup do
    @tactic_task = tactic_tasks(:one)
  end

  test "should get index" do
    get tactic_tasks_url
    assert_response :success
  end

  test "should get new" do
    get new_tactic_task_url
    assert_response :success
  end

  test "should create tactic_task" do
    assert_difference('TacticTask.count') do
      post tactic_tasks_url, params: { tactic_task: { description: @tactic_task.description, end_time_limit: @tactic_task.end_time_limit, executor: @tactic_task.executor, finished_time: @tactic_task.finished_time, name: @tactic_task.name, start_time_limit: @tactic_task.start_time_limit, status: @tactic_task.status, tactic_id: @tactic_task.tactic_id, type: @tactic_task.type } }
    end

    assert_redirected_to tactic_task_url(TacticTask.last)
  end

  test "should show tactic_task" do
    get tactic_task_url(@tactic_task)
    assert_response :success
  end

  test "should get edit" do
    get edit_tactic_task_url(@tactic_task)
    assert_response :success
  end

  test "should update tactic_task" do
    patch tactic_task_url(@tactic_task), params: { tactic_task: { description: @tactic_task.description, end_time_limit: @tactic_task.end_time_limit, executor: @tactic_task.executor, finished_time: @tactic_task.finished_time, name: @tactic_task.name, start_time_limit: @tactic_task.start_time_limit, status: @tactic_task.status, tactic_id: @tactic_task.tactic_id, type: @tactic_task.type } }
    assert_redirected_to tactic_task_url(@tactic_task)
  end

  test "should destroy tactic_task" do
    assert_difference('TacticTask.count', -1) do
      delete tactic_task_url(@tactic_task)
    end

    assert_redirected_to tactic_tasks_url
  end
end
