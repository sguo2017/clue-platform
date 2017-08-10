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

ActiveRecord::Schema.define(version: 20170809020242) do

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

  create_table "tactic_tasks", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.string "name"
    t.integer "tactic_id"
    t.string "category"
    t.string "executor"
    t.string "status"
    t.timestamp "finished_time"
    t.timestamp "start_time"
    t.timestamp "end_time"
    t.text "description"
    t.string "order"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
  end

  create_table "tactics", force: :cascade, options: "ENGINE=InnoDB DEFAULT CHARSET=utf8" do |t|
    t.string "name"
    t.integer "case_id"
    t.integer "created_by"
    t.string "status"
    t.string "flow_image_url"
    t.string "flow_data_url"
    t.string "executive_team"
    t.text "description"
    t.timestamp "start_time"
    t.timestamp "end_time"
    t.datetime "created_at", null: false
    t.datetime "updated_at", null: false
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
    t.index ["email"], name: "index_users_on_email", unique: true
    t.index ["reset_password_token"], name: "index_users_on_reset_password_token", unique: true
  end

end
