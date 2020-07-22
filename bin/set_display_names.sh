#!/usr/bin/env ruby
#
# Update the applications display name based on the release env file
#
# Usage
#
#   bin/set_display_names <?env>
#
# Example
#
#   bin/fetch_env
#
# Requirements
#
# 1. An .env.bt.release file in the root folder or an existing environment file
# in the route of the argument

require 'dotenv'
require 'open3'

# Constants
ENV_FILE = ARGV[0] || ".env.bt.release"
DISPLAY_NAME_KEY = "DISPLAY_NAME"
PLIST_PATH = "./ios/BT/Info.plist"
ANDROID_STRINGS_PATH="./android/app/src/bt/res/values/strings.xml"
SEPARATOR = "##################################################################"

def get_current_ios_name
  output, error, status = Open3.capture3(
    "/usr/libexec/PlistBuddy -c \"Print :CFBundleDisplayName\" \"#{PLIST_PATH}\""
  )
  if status.success?
    output.gsub(/\R+/, "")
  else
    puts "Could not read ios current name from file #{PLIST_PATH}, error: #{error}"
    exit 1
  end
end

def update_ios_display_name(new_name)
  puts "Updating ios display name from #{get_current_ios_name} to #{new_name}"
  output, error, status = Open3.capture3(
    "/usr/libexec/PlistBuddy -c \"Set :CFBundleDisplayName #{new_name}\" \"#{PLIST_PATH}\""
  )
  return if status.success?
  puts "Failed to update the name of the ios app with error: #{output}"
  exit 1
end

def get_current_android_name
  output, error, status = Open3.capture3(
    "xmllint --xpath \"/resources/string[@name='app_name']/text()\" #{ANDROID_STRINGS_PATH}"
  )
  if status.success?
    output
  else
    puts "Could not read android current name from file #{ANDROID_STRINGS_PATH}, error: #{error}"
    exit 1
  end
end

def update_android_display_name(new_name)
  puts "Updating android display name from #{get_current_android_name} to #{new_name}"
  _output, error, status = Open3.capture3(
"xmllint --shell #{ANDROID_STRINGS_PATH} << EOF
cd /resources/string[@name='app_name']
set #{new_name}
save
EOF
"
  )
  return if status.success?
  puts "Failed to update the name of the android app with error: #{error}"
  exit 1
end

def update_application_display_name
  environment = Dotenv.parse(File.open(ENV_FILE))
  display_name = environment.fetch(DISPLAY_NAME_KEY, false)

  if display_name
    update_ios_display_name(display_name)
    update_android_display_name(display_name)
    puts SEPARATOR
    puts "All done!"
  else
    puts "#{DISPLAY_NAME_KEY} not provided on #{ENV_FILE}"
  end
end

if File.exist?(ENV_FILE)
  update_application_display_name
else
  puts "#{ENV_FILE} not found on the root folder, environment file is needed"
end
