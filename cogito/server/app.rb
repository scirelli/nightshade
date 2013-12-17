# require sinatra/base vs sinatra so it won't load DSL methods
require 'sinatra/base'
require 'sinatra/reloader'
require 'sinatra/json'

require 'rack/parser'
require 'json'

require 'mongo_mapper'

require "sinatra/content_for"

class GateKeeper < Sinatra::Base
  helpers Sinatra::ContentFor
  
  def logged_in?
    !( session[:loggedIn].nil? || session[:loggedIn] == false)
  end

  get '/welcome' do
    erb :welcome
  end

  get('/') do
    puts "gatekeeper /"
    pass if logged_in?
    redirect to('/welcome')
  end

  get('/cogito') do
    pass if logged_in?
    redirect to('/welcome')
  end

  get('/plans') do
    pass if logged_in?
    redirect to('/welcome')
  end

  post('/plans') do
    pass if logged_in?
    redirect to('/welcome')
  end

end

class MyApp < Sinatra::Base
  helpers Sinatra::ContentFor

  configure do
    set :static, true
    set :public_dir, File.dirname(__FILE__) + '/../client'
    set :app_file, __FILE__   

    register Sinatra::Reloader
    also_reload 'routes/user'
    also_reload 'models/User'

    enable :sessions

    MongoMapper.database = 'cogito'

    use Rack::Parser, :content_types => {
      'application/json' => Proc.new { |body| ::MultiJson.decode body }
    }

    # authentication
    use GateKeeper
  end

  configure :development do
    enable :logging, :dump_errors, :raise_errors
  end

  require_relative 'routes/init'
  require_relative 'helpers/init'
  require_relative 'models/init' 
end



