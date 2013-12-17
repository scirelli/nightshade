class MyApp < Sinatra::Base

  get '/welcome' do
    erb :welcome
  end
end