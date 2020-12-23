#!/usr/bin/env ruby
#
# Fetch Health Authority Specific Environment
#
# Usage
#
#   bin/fetch_env <health-authority-label> <github-token>
#
# Example
#
#   bin/fetch_env pc <token>
#
# Requirements
#
# 1. Remote access to the environment repo
# 2. A github personal access token saved in `.env`:
#    https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token

require "open3"
require_relative "./helpers"

HA_LABEL = ARGV[0]
ACCESS_TOKEN = ARGV[1]

def fetch_env
  token = ACCESS_TOKEN
  validate_token!(token)
  validate_ha_label!(HA_LABEL, "fetch_ha_env")

  puts "🛠 Updating.env fils:"

  dev_env_source = ".env.bt"
  staging_env_source = ".env.bt.staging"
  release_env_source = ".env.bt.release"


  base_url = "https://#{token}@raw.githubusercontent.com/Path-Check/pathcheck-mobile-resources/"

  dev_env_url = 
  "#{base_url}#{mobile_resources_commit}/environment/#{HA_LABEL}/.env.bt"

  staging_env_url =
  "#{base_url}#{mobile_resources_commit}/environment/#{HA_LABEL}/.env.bt.staging"

  release_env_url =
  "#{base_url}#{mobile_resources_commit}/environment/#{HA_LABEL}/.env.bt.release"

  fetch_and_write_file(dev_env_source, dev_env_url)
  fetch_and_write_file(staging_env_source, staging_env_url)
  fetch_and_write_file(release_env_source, release_env_url)
  
  puts ""
  puts "✅ Done"
end

def fetch_and_write_file(filename, remote_url)
  open(filename, 'w') do |f|
    Open3.popen2e("curl", "-f", "-s", remote_url) do |_, stdout_and_err, wait_thr|
      if wait_thr.value.exitstatus != 0
        abort("Fetch failed")
      end
      stdout_and_err.each do |line|
        f << line
      end
      wait_thr.value
    end
  end
  print "."
end

fetch_env
