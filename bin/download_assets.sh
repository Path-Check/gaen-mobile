#!/usr/bin/env ruby
#
# Download specific assets for the health authority
#
# Usage
#
#   bin/download_assets.sh <health-authority-label> <github-token>
#
# Example
#
#   bin/download_assets.sh guam <token>
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
ACCESS_TOKEN = ARGV[1] || ENV.fetch("ACCESS_TOKEN")

WORKING_DIRECTORY="temporary_assets"

def download_file(file_name, remote_url)
  _output, error, status = Open3.capture3(
    "curl", remote_url, "-L", "-o", file_name
  )
  puts error
  status.success?
end

def clear_temporary_assets
  if Dir.exists?(WORKING_DIRECTORY)
    _output, error, status = Open3.capture3("rm", "-rf", WORKING_DIRECTORY)
    if !status.success?
      puts "Could not clear the working directory"
      exit 1
    end
  end
end

def unzip_to_working_directory
  zip_name = "app-icons.zip"
  icons_zip_url =
  "https://#{ACCESS_TOKEN}@raw.githubusercontent.com/Path-Check/pathcheck-mobile-resources/master/assets/#{HA_LABEL}/#{zip_name}"
  file_destination = "#{WORKING_DIRECTORY}/#{zip_name}"
  clear_temporary_assets
  Dir.mkdir(WORKING_DIRECTORY)
  return false unless download_file(file_destination, icons_zip_url)
  _output, error, status = Open3.capture3(
    "unzip", file_destination, "-d", WORKING_DIRECTORY
  )
  unless status.success?
    puts "Failed to unzip file"
    return false
  end
  return true
end

def cleanup
  # delete the temporary_assets
  # git checkout
end

def copy_assets_to_destinations
  ios_iconset_path = "ios/BT/Images.xcassets/AppIcon.appiconset"
  _output, error, status = Open3.capture3("rm", "-rf", ios_iconset_path)
  new_ios_iconset_path =
  "#{WORKING_DIRECTORY}/Assets.xcassets/AppIcon.appiconset"
  _output, error, status = Open3.capture3(
    "cp", "-r", new_ios_iconset_path, ios_iconset_path
  )
end

def download_assets
  if !valid_token(ACCESS_TOKEN)
    puts "No valid github token set"
    puts "Set a valid token in your .env file"
    exit 1
  end

  if !HA_LABEL
    puts "No HA label provided"
    puts "provide a label as a parameter e.g. $ bin/download_assets.sh pc"
    exit 1
  end

  puts "...fetching assets for #{HA_LABEL}"

  if unzip_to_working_directory
    puts "assets downloaded and copied for #{HA_LABEL}, please verify before
  submitting"
  else
    cleanup
    puts "Failed to download and copy assets"
  end
end

def valid_token(token)
  token.length == 40
end

download_assets
