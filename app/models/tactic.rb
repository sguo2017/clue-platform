class Tactic < ApplicationRecord
  belongs_to :case
  has_many :tactic_tasks
end
