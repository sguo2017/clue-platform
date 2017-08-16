class Case < ApplicationRecord
  has_and_belongs_to_many :tactics
end
