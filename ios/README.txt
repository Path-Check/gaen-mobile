1: RVM install with following commands to install a specific ruby version 

https://rvm.io/rubies/default

before installation before install yarn -> dev_ and pod set ruby 2.6.5 as default

RVM wird über folgenden Shell-Befehl installiert:

curl -sSL https://get.rvm.io | bash -s stable

Um Ruby in Version 2.4.0 zu installieren, wird folgender RVM-Befehl benutzt:

rvm install 2.4.0 --autolibs=read-only

Um Ruby 2.4.0 als Standard zu setzen, wird folgender RVM-Befehl benutzt:

rvm alias create default ruby-2.4.0

Nun muss noch Bundler für Ruby 2.4.0 mittels gem installiert werden (Gems werden unter RVM automatisch lokal unter "~/.rvm/gems/" installiert):

gem install bundler

Ruby-Version für Passenger ändern
Damit Passenger die richtige Ruby-Version nutzt, muss diese dann noch in der .htaccess-Datei der Anwendung eingetragen werden ("u12345" muss durch den Webserver-Benutzer ersetzt werden):

PassengerRuby /homepages/u12345/.rvm/wrappers/ruby-2.4.0/ruby


Stay tuned offensive:

wipe-dependencies.js

https://medium.com/@jh3y/how-to-update-all-npm-packages-in-your-project-at-once-17a8981860ea


Ruby update from 2.6.1 newest Version (Take care which is the last supported version)

https://www.phusionpassenger.com/library/walkthroughs/deploy/ruby/ownserver/nginx/oss/install_language_runtime.html#optional-install-node-js-if-you-re-using-rails
https://bundler.io/rationale.html


to update the gem file for ruby upgrade use this link : https://stackify.com/install-ruby-on-your-mac-everything-you-need-to-get-going/
Follow the steps in the app directory. 
Now you can update the gemfile and the gemfile.lock.
go to the ./ios folder and use $pod install.
After this Updating node and yarn.
Deleting node_modules directory and running yarn install again


RVM wird über folgenden Shell-Befehl installiert:

curl -sSL https://get.rvm.io | bash -s stable

Um Ruby in Version 2.4.0 zu installieren, wird folgender RVM-Befehl benutzt:

rvm install 2.4.0 --autolibs=read-only

Um Ruby 2.4.0 als Standard zu setzen, wird folgender RVM-Befehl benutzt:

rvm alias create default ruby-2.4.0

Nun muss noch Bundler für Ruby 2.4.0 mittels gem installiert werden (Gems werden unter RVM automatisch lokal unter "~/.rvm/gems/" installiert):

gem install bundler

Ruby-Version für Passenger ändern
Damit Passenger die richtige Ruby-Version nutzt, muss diese dann noch in der .htaccess-Datei der Anwendung eingetragen werden ("u12345" muss durch den Webserver-Benutzer ersetzt werden):

PassengerRuby /homepages/u12345/.rvm/wrappers/ruby-2.4.0/ruby
