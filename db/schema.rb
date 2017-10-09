# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended that you check this file into your version control system.

ActiveRecord::Schema.define(version: 20170925082632) do

  create_table "call_analyse_savers", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.string "title"
    t.integer "user_id"
    t.string "image_url"
    t.string "data_url"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "calllists", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.string "from_num"
    t.string "to_num"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "batch"
    t.string "note"
  end

  create_table "cases", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.string "name"
    t.string "catalog"
    t.string "role"
    t.string "status"
    t.text "detail"
    t.string "photo"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "cases_tactics", id: false, force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.bigint "tactic_id", null: false
    t.bigint "case_id", null: false
    t.index ["case_id", "tactic_id"], name: "index_cases_tactics_on_case_id_and_tactic_id"
    t.index ["tactic_id", "case_id"], name: "index_cases_tactics_on_tactic_id_and_case_id"
  end

  create_table "extra_tasks", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.string "name"
    t.integer "result_id"
    t.integer "tactic_task_id"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "suspects", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.string "name"
    t.string "userName"
    t.string "realName"
    t.string "email"
    t.string "born"
    t.datetime "dob"
    t.string "photo"
    t.string "status"
    t.string "skills"
    t.string "settings"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "suspects_teams", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.string "name"
    t.string "catalog"
    t.string "company"
    t.string "addr"
    t.string "account"
    t.string "photo"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "tactic_categories", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.string "name"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.index ["name"], name: "index_tactic_categories_on_name", unique: true
  end

  create_table "tactic_covers", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.integer "tactic_id"
    t.string "category"
    t.text "url"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "tactic_tasks", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.string "name"
    t.integer "tactic_id"
    t.string "category"
    t.string "status"
    t.date "finished_time"
    t.date "start_time"
    t.date "end_time"
    t.text "description"
    t.string "order"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "attachment_url"
    t.string "attachment_name"
  end

  create_table "tactic_tasks_users", id: false, force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.bigint "user_id", null: false
    t.bigint "tactic_task_id", null: false
    t.index ["tactic_task_id", "user_id"], name: "index_tactic_tasks_users_on_tactic_task_id_and_user_id"
    t.index ["user_id", "tactic_task_id"], name: "index_tactic_tasks_users_on_user_id_and_tactic_task_id"
  end

  create_table "tactics", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.string "name"
    t.integer "created_by"
    t.string "status"
    t.string "thumbnail_url"
    t.string "flow_data_url"
    t.string "executive_team"
    t.text "description"
    t.date "start_time"
    t.date "end_time"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "category"
    t.boolean "classic", default: false
  end

  create_table "users", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.string "email", default: "", null: false
    t.string "encrypted_password", default: "", null: false
    t.string "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer "sign_in_count", default: 0, null: false
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string "current_sign_in_ip"
    t.string "last_sign_in_ip"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
    t.string "position"
    t.string "name"
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

end
