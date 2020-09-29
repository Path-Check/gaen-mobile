#!/usr/bin/env ruby
#
# Downloads the image overrides used inside the application
#
# Usage
#
#   bin/fetch_configurable_images.sh <health-authority-label> <github-token>
#
# Example
#
#   bin/fetch_configurable_images.sh pc
#
# Requirements
#
# 1. Remote access to the environment repo
# 2. A github personal access token saved in `.env`:
#    https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token

require "open3"
require "dotenv"
require_relative "./fetch_configurable_images_methods"
Dotenv.load

HA_LABEL = ARGV[0]
ACCESS_TOKEN = ARGV[1] || ENV.fetch("ACCESS_TOKEN")
validate_token!(ACCESS_TOKEN)
validate_ha_label!(HA_LABEL, "download_welcome_image")

puts "...fetching configurable image assets for #{HA_LABEL}"

fetch_configurable_images(HA_LABEL, ACCESS_TOKEN)
