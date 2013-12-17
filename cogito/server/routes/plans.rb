class MyApp < Sinatra::Base

  get '/plans' do

    userId = session[:user][:_id]
    json Plan.fetch(userId)

  end

  get '/plans/:id' do

    userId = session[:user][:_id]
    json Plan.get(userId, params[:id])

  end

  post '/plans' do

    id = session[:user][:_id]
    plan = { :text => params[:text] }
    json Plan.add_plan(id, plan)

  end

  put '/plans/:id' do
    ignore = ["splat", "captures", "id"]

    userId = session[:user][:_id]
    keys = params.keys

    update = params.select do |key|
      !ignore.include?(key)
    end

    json Plan.update(userId, params[:id], update)
  end

  delete '/plans/:id' do

  end

end
