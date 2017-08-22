class TacticTask < ApplicationRecord
  belongs_to :tactic
  has_and_belongs_to_many :user
end
