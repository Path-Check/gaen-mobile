#!/usr/bin/env ruby
#
# Fetch the HA data and sets the display names on the ios and android builds
#
# Usage
#
#   bin/fetch_env <health-authority-label>
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

HA_LABEL = ARGV[0]

fetching_env_succeeded = system("./bin/fetch_ha_env.sh #{HA_LABEL}")

fetching_env_succeeded && system("./bin/set_display_names.sh")
