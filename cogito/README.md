# Cogito App #

Beginnings of planner application.

### Application Stack ######

- Ruby/JRuby

- Sinatra

- Google Maps v3

- AngularJS

- Bootstrap 3

### Install RVM ###
    # https://rvm.io/rvm/install
    \curl -L https://get.rvm.io | bash

### Install Ruby/JRuby ###

    # list available rubies
    rvm list known

    # for ruby 1.9.3
    rvm install 1.9.3

    # for jruby 1.7.4
    rvm install jruby-1.7.4

### Create a gemset ###
    # list available rubies
    rvm list

    # select one such as jruby-1.7.4
    rvm 1.7.4

     # create gemset
     rvm gemset create my-gemset

     # select gemset
     rvm use 1.7.4@my-gemset

### Dependencies ######

    gem install bundler
    bundle install

### Launch ######

    rackup config.ru

### Creating War ######

    bundle exec warble

### Tips ######

#### Load specific ruby version and gemset ####

    # create file .ruby-version
    # [my-ruby-version]
    1.7.4

    # create file .ruby-gemset
    # [my-ruby-version]
    my-gemset 

    # which translates to rvm use 1.7.3@sinatra
    # or you can use a .rvmrc
    rvm use 1.7.3@my-gemset
