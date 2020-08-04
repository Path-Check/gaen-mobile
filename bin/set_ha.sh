#!/usr/bin/env ruby
#
# Fetch the HA data and configures the ios and android builds according to the provided HA.
#
# Usage
#
#   bin/set_ha <health-authority-label>
#
# Example
#
#   bin/set_ha pc
#
# Requirements
#
# 1. Remote access to the environment repo
# 2. A github personal access token saved in `.env`:
#    https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token

require 'open3'
require 'dotenv'
Dotenv.load

HA_LABEL = ARGV[0]
ACCESS_TOKEN = ARGV[1] || ENV.fetch("ACCESS_TOKEN")

if (ACCESS_TOKEN) then
  fetching_env_succeeded = system("./bin/fetch_ha_env.sh #{HA_LABEL} #{ACCESS_TOKEN}")
else
   raise "Empty github access token"
end

fetching_env_succeeded && system("./bin/configure_builds.sh")
