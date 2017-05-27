json.extract! suspect, :id, :name, :userName, :realName, :email, :born, :dob, :photo, :status, :skills, :settings, :created_at, :updated_at
json.url suspect_url(suspect, format: :json)
