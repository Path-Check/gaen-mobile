#!/usr/bin/env ruby
#
# Fetch Health Authority Specific Environment
#
# Usage
#
#   bin/fetch_env <health-authority-label>
#
# Example
#
#   bin/fetch_env pc
#
# Requirements
#
# 1. Remote access to the environment repo
# 2. A github personal access token saved in `.env`:
#    https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token

require "open3"
require 'dotenv'
Dotenv.load

HA_LABEL = ARGV[0]

def fetch_env
  token = ENV.fetch("ACCESS_TOKEN")

  if !valid_token(token) then
    puts "No valid github token set"
    puts "Set a valid token in your .env file"
    exit
  end

  if !HA_LABEL then
    puts "No HA label provided"
    puts "provide a label as a parameter e.g. $ bin/fetch_ha_env.sh pc"
    exit
  end

  puts "...fetching .env for #{HA_LABEL}"

  dev_env_source = ".env.bt"
  release_env_source = ".env.bt.release"
  google_service_source = "ios/GoogleService-Info.plist"

  dev_env_url =
  "https://#{token}@raw.githubusercontent.com/Path-Check/pathcheck-mobile-resources/master/environment/#{HA_LABEL}/.env.bt"

  release_env_url =
  "https://#{token}@raw.githubusercontent.com/Path-Check/pathcheck-mobile-resources/master/environment/#{HA_LABEL}/.env.bt.release"

  google_service_url =
  "https://#{token}@raw.githubusercontent.com/Path-Check/pathcheck-mobile-resources/master/firebase/#{HA_LABEL}/GoogleService-Info.plist"

  fetch_and_write_file(dev_env_source, dev_env_url)
  fetch_and_write_file(release_env_source, release_env_url)
  fetch_and_write_file(google_service_source, google_service_url)

  puts "finished fetching .env for #{HA_LABEL}"
end

def fetch_and_write_file(filename, remote_url)
  open(filename, 'w') do |f|
    Open3.popen2e("curl", "-s", remote_url) do |_, stdout_and_err, wait_thr|
      stdout_and_err.each do |line|
        f << line 
      end
      wait_thr.value
    end
  end
  print "."
end

def valid_token(token) 
  token.length == 40
end

fetch_env
puts exec('git update-index --assume-unchanged ios/GoogleService-Info.plist')
