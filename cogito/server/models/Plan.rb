class Plan
  include MongoMapper::EmbeddedDocument

  key :date,  Time,   :default => lambda { Time.new }
  key :name,  String, :defualt => ''
  key :text,  String, :required => true
  timestamps!

  def self.get(userId, planId)

    plans = self.fetch(userId)
    _plan = plans.each do |plan|
      break plan if plan._id.to_s == planId.to_s
    end

    return _plan
  end

  def self.fetch(userId)

    user = User.get(userId)
    user.plans

  end

  def self.add_plan(userId, plan)

    _plan = Plan.new(plan)
    User.push(userId, :plans => _plan.to_mongo)

    user = User.get(userId)
    
    if user.save(:safe => true)
      return user.plans
    else
      return { :errros => user.errors }
    end 

  end

  def self.update(userId, planId, update)
    plan = self.get(userId, planId)
    plan.update_attributes(update)
    if plan.save(:safe => true)
      return plan
    else
      return { :errors => plan.errors }
    end
  end
end