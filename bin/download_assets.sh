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
require "dotenv"
require_relative "./helpers"
Dotenv.load

HA_LABEL = ARGV[0]
ACCESS_TOKEN = ARGV[1] || ENV.fetch("ACCESS_TOKEN")

WORKING_DIRECTORY="temporary_assets"

########################## HELPERS START ######################################

def clear_temporary_assets
  if Dir.exists?(WORKING_DIRECTORY)
    return if delete_folder(WORKING_DIRECTORY)

    puts "Could not clear the working directory"
    exit 1
  end
end

########################## HELPERS END ########################################

########################## FILE MANIPULATION AND RESCUE START #################

def unzip_to_working_directory
  puts "Fetching configuration from pathcheck-mobile-resources commit #{mobile_resources_commit}"

  base_url = "https://#{ACCESS_TOKEN}@raw.githubusercontent.com/Path-Check/pathcheck-mobile-resources/"
  zip_name = "app-assets.zip"
  icons_zip_url =
  "#{base_url}#{mobile_resources_commit}/assets/#{HA_LABEL}/#{zip_name}"
  file_destination = "#{WORKING_DIRECTORY}/#{zip_name}"
  clear_temporary_assets
  Dir.mkdir(WORKING_DIRECTORY)
  return false unless download_file(file_destination, icons_zip_url)

  _output, error, status = Open3.capture3(
    "unzip", file_destination, "-d", WORKING_DIRECTORY
  )
  puts "Failed to unzip file" unless status.success?
  status.success?
end

ANDROID_ASSETS_ROOT_PATH = "android/app/src/main"
IOS_ASSETS_ROOT_PATH = "ios/BT/Images.xcassets"

def abort
  clear_temporary_assets
  Open3.capture3("git", "checkout", IOS_ASSETS_ROOT_PATH)
  Open3.capture3("git", "clean", "-f")
  Open3.capture3("git", "checkout", ANDROID_ASSETS_ROOT_PATH)
end

def copy_ios_icons
  ios_iconset_path = "#{IOS_ASSETS_ROOT_PATH}/AppIcon.appiconset"
  return false unless delete_folder(ios_iconset_path)

  new_ios_iconset_path =
    "#{WORKING_DIRECTORY}/Assets.xcassets/AppIcon.appiconset"
  copy_folder(new_ios_iconset_path, ios_iconset_path)
end

ANDROID_ASSET_FOLDERS = %w[
  drawable-hdpi
  drawable-mdpi
  drawable-xhdpi
  drawable-xxhdpi
  drawable-xxxhdpi
  mipmap-hdpi
  mipmap-mdpi
  mipmap-xhdpi
  mipmap-xxhdpi
  mipmap-xxxhdpi
]
ANDROID_PLAYSTORE_LAUNCHER_ICON = "ic_launcher-playstore.png"
ANDROID_COLORS_XML = "values/colors.xml"

def remove_previous_android_assets
  cleaned_assets = ANDROID_ASSET_FOLDERS.map do |folder|
    delete_folder("#{ANDROID_ASSETS_ROOT_PATH}/res/#{folder}")
  end.all?
  return false unless cleaned_assets
  colors_xml_path = "#{ANDROID_ASSETS_ROOT_PATH}/res/#{ANDROID_COLORS_XML}"
  playstore_icon_path =
    "#{ANDROID_ASSETS_ROOT_PATH}/#{ANDROID_PLAYSTORE_LAUNCHER_ICON}"
  delete_file(colors_xml_path) && delete_file(playstore_icon_path)
end

def copy_android_icons
  if remove_previous_android_assets
    copied_all_assets = ANDROID_ASSET_FOLDERS.map do |folder|
      source_path =
        "#{WORKING_DIRECTORY}/android/#{folder}"
      destination_path =
        "#{ANDROID_ASSETS_ROOT_PATH}/res/#{folder}"
      copy_folder(source_path, destination_path)
    end.all?
    return false unless copied_all_assets
    colors_xml_source_path =
      "#{WORKING_DIRECTORY}/android/#{ANDROID_COLORS_XML}"
    colors_xml_destination_path =
      "#{ANDROID_ASSETS_ROOT_PATH}/res/#{ANDROID_COLORS_XML}"
    playstore_icon_source_path =
      "#{WORKING_DIRECTORY}/playstore.png"
    playstore_icon_destination_path =
      "#{ANDROID_ASSETS_ROOT_PATH}/#{ANDROID_PLAYSTORE_LAUNCHER_ICON}"
    copy_file(colors_xml_source_path, colors_xml_destination_path) &&
      copy_file(playstore_icon_source_path, playstore_icon_destination_path)
  else
    puts "Failed to remove previous assets"
    return false
  end
end

def copy_ios_logo
  ios_logo_path = "#{IOS_ASSETS_ROOT_PATH}/logoImage.imageset"
  return false unless delete_folder(ios_logo_path)

  new_ios_logo_path =
    "#{WORKING_DIRECTORY}/logoImage.imageset"
  copy_folder(new_ios_logo_path, ios_logo_path)
end

def copy_assets_to_destinations
  copy_ios_icons && copy_android_icons && copy_ios_logo
end

########################## FILE MANIPULATION AND RESCUE END #################

def download_assets
  validate_token!(ACCESS_TOKEN)
  validate_ha_label!(HA_LABEL, "download_assets")

  puts "...fetching assets for #{HA_LABEL}"

  if unzip_to_working_directory && copy_assets_to_destinations
    puts "assets downloaded and copied for #{HA_LABEL}, please verify before submitting"
    clear_temporary_assets
  else
    abort
    puts "Failed to download and copy assets"
  end
rescue => error
  abort
  puts "Something went wrong #{error.message}"
end

download_assets
