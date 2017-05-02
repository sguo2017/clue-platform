namespace :clue do
  desc "TODO"
  task init: :environment do
  	User.create(email:'admin@qq.com', password:'888888')
  end

end
