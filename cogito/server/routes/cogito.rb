class MyApp < Sinatra::Base

	get '/' do
    redirect to('/cogito');
	end

  get '/cogito' do
    # render home page
    erb :cogito
  end

end