#!/usr/bin/env ruby
#
# Download the copy json for a specific HA and places it on the configuration
# folder
#
# Usage
#
#   bin/download_brand_colors.sh <health-authority-label> <github-token>
#
# Example
#
#   bin/download_brand_colors.sh pc <token>
#
# Requirements
#
# 1. Remote access to the environment repo
# 2. A github personal access token saved in `.env`:
#    https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token

require "open3"
require "dotenv"
require_relative "./download_brand_colors_methods"
Dotenv.load

HA_LABEL = ARGV[0]
ACCESS_TOKEN = ARGV[1] || ENV.fetch("ACCESS_TOKEN")
validate_token!(ACCESS_TOKEN)
validate_ha_label!(HA_LABEL, "download_brand_colors")

puts "...fetching brand colors for #{HA_LABEL}"

download_brand_colors_file(HA_LABEL, ACCESS_TOKEN)
