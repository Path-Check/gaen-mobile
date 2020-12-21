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
require_relative "./download_copy_methods"
require_relative "./download_links_methods"
require_relative "./download_brand_colors_methods"
require_relative "./fetch_configurable_images_methods"

Dotenv.load

HA_LABEL = ARGV[0]
ACCESS_TOKEN = ARGV[1] || ENV.fetch("ACCESS_TOKEN")


if (ACCESS_TOKEN) then
  puts "Setting HA Configuration and Settings:"
  puts "--------------------------------------"
  puts "Health Authority:      #{HA_LABEL}"
  puts "Resources Commit Hash: #{mobile_resources_commit}"
  puts ""

  fetching_env_succeeded = system("./bin/fetch_ha_env.sh #{HA_LABEL} #{ACCESS_TOKEN}")
else
  raise "Empty github access token"
end

def download_all_assets
  system("./bin/download_assets.sh #{HA_LABEL} #{ACCESS_TOKEN}")
  download_copy_file(HA_LABEL, ACCESS_TOKEN)
  download_links_file(HA_LABEL, ACCESS_TOKEN)
  download_brand_colors_file(HA_LABEL, ACCESS_TOKEN)
  fetch_configurable_images(HA_LABEL, ACCESS_TOKEN)
  true
end

if fetching_env_succeeded && system("./bin/configure_builds.sh") &&
  download_all_assets
  exit 0
else
  exit 1
end
