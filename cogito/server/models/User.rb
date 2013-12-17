class User
  include MongoMapper::Document

  key :email,     String, :required => true, :unique => true
  key :firstname, String, :required => true
  key :lastname,  String, :required => true
  key :password,  String, :required => true
  many :plans
  timestamps!

  def self.get(id)

    self.find_by_id(id)

  end

  def self.login(email, password)

    password = Digest::SHA1.hexdigest password
    user = self.find_by_email_and_password(email, password)
    return user

  end

  def self.register(user)

    if user[:email].nil? || user[:firstname].nil? || user[:lastname].nil? || user[:password].nil? 
      puts user[:email]
      puts user[:firstname]
      puts user[:lastname]
      puts user[:password]
      return { :errors => "something was nil" }
    end
    
    user = self.create(
      :email => user[:email], 
      :firstname => user[:firstname],
      :lastname => user[:lastname],
      :password => (Digest::SHA1.hexdigest user[:password])
    )

    if user.save(:safe => true)
      return user
    else
      return { :errors => user.errors }
    end
  end

end
