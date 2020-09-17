#!/usr/bin/env ruby
#
# Download the bitrise configuration
#
# Usage
#
#   bin/download_bitrise.sh <github-token>
#
# Example
#
#   bin/download_bitrise.sh <token>
#
# Requirements
#
# 1. Remote access to the environment repo
# 2. A github personal access token saved in `.env`:
#    https://docs.github.com/en/github/authenticating-to-github/creating-a-personal-access-token

require "open3"
require "dotenv"
require_relative "./helpers"
Dotenv.load

ACCESS_TOKEN = ARGV[0] || ENV.fetch("ACCESS_TOKEN")
validate_token!(ACCESS_TOKEN)

def download_bitrise_file(access_token)
  bitrise_file_name = "bitrise.yml"
  bitrise_url = "https://#{access_token}@raw.githubusercontent.com/Path-Check/pathcheck-mobile-resources/#{mobile_resources_commit}/#{bitrise_file_name}"

  file_destination = File.join(File.dirname(__FILE__), '../bitrise.yml')

  return true if download_file(file_destination, bitrise_url)

  puts "Failed to download bitrise file"
end

puts "...fetching bitrise file"
download_bitrise_file(ACCESS_TOKEN)
