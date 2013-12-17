class MyApp < Sinatra::Base

  get '/partials/:partial' do
    erb params[:partial].to_sym, :layout => false
  end

end