class MyApp < Sinatra::Base
  post '/login' do
      if params[:email].nil? || params[:password].nil?
        redirect to('/welcome')
      end

      user = User.login(params[:email], params[:password])

      if user.nil?
        puts "invalid credentials"
        status 401 # unauthorized
        json :redirect => '/welcome'
      else
        puts "valid credentials"
        session[:loggedIn] = true
        session[:user] = { :_id => user._id } 
        json :redirect => "/cogito"
      end
  end

  get '/logout' do
    puts "logout"
    session[:loggedIn] = false
    session[:user] = false
    redirect to('/')
  end

  post '/register' do
    params[:password] = params[:password].to_s
    params[:confirm] = params[:confirm].to_s

    # password does not equal confirm
    unless params[:password].eql? params[:confirm]
      status 400 # bad request
      json :errors => "passwords do not match"
    end

    user = User.register({
      :email => params[:email],
      :firstname => params[:firstname],
      :lastname => params[:lastname],
      :password => params[:password]
    })

    puts "registering"
    # errors were returned
    unless user[:errors].nil?
      puts 'error', user.inspect
      status 400
      return json user[:errors]
    end

    status 200
    json :redirect => "/welcome"
  end

  def html(view)
    File.read(File.join('views', "#{view.to_s}.html"))
  end
end