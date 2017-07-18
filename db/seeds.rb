# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rails db:seed command (or created alongside the database with db:setup).
#
# Examples:
#
#   movies = Movie.create([{ name: 'Star Wars' }, { name: 'Lord of the Rings' }])
#   Character.create(name: 'Luke', movie: movies.first)

if Calllist.all.size<1000
  $start=18620788695
  while $start<=18620789695 do
    for j in 1..100
      Calllist.create(:from_num=>$start,:to_num=>$start+j)
    end
    $start=$start+101
  end
end
if User.where(:email=>'admin@qq.com').size==0
  User.create(:email=>"admin@qq.com",:password=>'888888')
end
