#!/usr/bin/env ruby
#
# Configures the iOS and android builds according to the contents of the provided environment file or by default `.env.bt.release`
# The configured values are:
#   - iOS and android builds application name or display name
#   - iOS build bundle identifier on the project file
#   - android build applicationId on the build.gradle file
#
# Usage
#
#   bin/configure_builds <?env>
#
# Example
#
#   bin/configure_builds
#
# Requirements
#
# 1. An .env.bt.release file in the root folder or an existing environment file in the route of the argument with keys for:
#   - DISPLAY_NAME
#   - IOS_BUNDLE_ID
#   - ANDROID_APPLICATION_ID

require 'dotenv'
require 'open3'

# Constants
ENV_FILE = ARGV[0] || ".env.bt.release"
PLIST_PATH = "./ios/BT/Info.plist"
ANDROID_STRINGS_PATH="./android/app/src/main/res/values/strings.xml"
SEPARATOR = "##################################################################"

def failure_message(message:)
  puts SEPARATOR
  puts "🚫 #{message}"
  puts SEPARATOR
end

########################## HELPERS START #######################################

def update_value_on_plist(file_path:, key:, value:)
  _output, error, status = Open3.capture3(
    "/usr/libexec/PlistBuddy -c \"Set :#{key} #{value}\" \"#{file_path}\""
  )
  return true if status.success?
  failure_message "Could not update #{key} to #{value} on plist file #{file_path} with error: #{error}"
  return false
end

def read_value_from_plist(file_path:, key:)
  output, error, status = Open3.capture3(
    "/usr/libexec/PlistBuddy -c \"Print :#{key}\" \"#{file_path}\""
  )
  return output.gsub(/\R+/, "") if status.success?
  failure_message "Could not read #{key} on plist file #{file_path}"
  return nil
end

def read_value_from_xml(file_path:, xpath:)
  output, error, status = Open3.capture3(
    "xmllint --xpath \"#{xpath}\" #{file_path}"
  )
  return output if status.success?
  failure_message "Could not read #{xpath} on xml file #{file_path} with error:
  #{error}"
  return nil
end

def update_value_on_xml(file_path:, xpath:, value:)
  _output, error, status = Open3.capture3(
"xmllint --shell #{file_path} << EOF
cd #{xpath}
set #{value}
save
EOF
")
  return true if status.success?
  failure_message "Could not update #{xpath} to #{value} on xml file #{file_path} with error: #{error}"
  return false
end

def replace_string_in_file(file_path:, regex:, value:)
  file_contents = File.read(file_path)
  new_contents = file_contents.gsub(regex, value)
  if new_contents.match(value).size > 0
    File.open(file_path, 'w') { |f| f.write new_contents }
  else
    failure_message "Couldn't match anything with #{regex} on #{file_path}"
  end
end

########################## HELPERS END #######################################

def get_current_ios_name
  output = read_value_from_plist(
    file_path: PLIST_PATH,
    key: 'CFBundleDisplayName'
  )
  return output if output
  exit 1
end

def update_ios_display_name(new_name)
  puts "Updating ios display name from #{get_current_ios_name} to #{new_name}"
  return if update_value_on_plist(
    file_path: PLIST_PATH,
    key: 'CFBundleDisplayName',
    value: new_name
  )
  exit 1
end

def get_current_android_name
  output = read_value_from_xml(
    file_path: ANDROID_STRINGS_PATH,
    xpath: "/resources/string[@name='app_name']/text()"
  )
  return output if output
  exit 1
end

def update_android_display_name(new_name)
  puts "Updating android display name from #{get_current_android_name} to #{new_name}"
  return if update_value_on_xml(
    file_path: ANDROID_STRINGS_PATH,
    xpath: "/resources/string[@name='app_name']",
    value: new_name
  )
  exit 1
end

DISPLAY_NAME_KEY = "DISPLAY_NAME"
def update_application_display_name
  environment = Dotenv.parse(File.open(ENV_FILE))
  display_name = environment.fetch(DISPLAY_NAME_KEY, false)

  if display_name
    update_ios_display_name(display_name)
    update_android_display_name(display_name)
    return true
  else
    failure_message "#{DISPLAY_NAME_KEY} not provided on #{ENV_FILE}"
    exit 1
  end
end

def update_ios_bundle_identifier(bundle_id)
  puts "Updating ios bundle_id to #{bundle_id}"
  replace_string_in_file(
    file_path: './ios/COVIDSafePaths.xcodeproj/project.pbxproj',
    regex: /PRODUCT_BUNDLE_IDENTIFIER = org.pathcheck(.+);/,
    value: "PRODUCT_BUNDLE_IDENTIFIER = #{bundle_id};"
  )
end

def update_android_application_id(application_id)
  puts "Updating android applicationId to #{application_id}"
  replace_string_in_file(
    file_path: './android/app/build.gradle',
    regex: /applicationId (.+)/,
    value: "applicationId \"#{application_id}\""
  )
end

IOS_BUNDLE_IDENTIFIER_KEY = "IOS_BUNDLE_ID"
ANDROID_APPLICATION_ID_KEY = "ANDROID_APPLICATION_ID"
def update_bundle_identifiers
  environment = Dotenv.parse(File.open(ENV_FILE))
  ios_bundle_identifier = environment.fetch(IOS_BUNDLE_IDENTIFIER_KEY, false)
  android_application_id = environment.fetch(ANDROID_APPLICATION_ID_KEY, false)

  if ios_bundle_identifier && android_application_id
    update_ios_bundle_identifier(ios_bundle_identifier)
    update_android_application_id(android_application_id)
  else
    failure_message "Both ios bundle identifier and android id are required"
    exit 1
  end
end

################################# iOS Specific Configuration ##########################################

def get_current_ios_en_api_version
  output = read_value_from_plist(
    file_path: PLIST_PATH,
    key: 'ENAPIVersion'
  )
  return output if output
  exit 1
end

def update_ios_en_api_version(new_en_api_version)
  puts "Updating ios en api version from #{get_current_ios_en_api_version} to #{new_en_api_version}"
  return if update_value_on_plist(
    file_path: PLIST_PATH,
    key: 'ENAPIVersion',
    value: new_en_api_version
  )
  exit 1
end

def get_current_ios_en_region
  output = read_value_from_plist(
    file_path: PLIST_PATH,
    key: 'ENDeveloperRegion'
  )
  return output if output
  exit 1
end

def update_ios_en_region(new_en_region)
  puts "Updating ios en region from #{get_current_ios_en_region} to #{new_en_region}"
  return if update_value_on_plist(
    file_path: PLIST_PATH,
    key: 'ENDeveloperRegion',
    value: new_en_region
  )
  exit 1
end

IOS_EN_REGION_KEY = "EN_DEVELOPER_REGION"
IOS_EN_API_VERSION_KEY = "EN_API_VERSION"

def update_ios_configuration
  environment = Dotenv.parse(File.open(ENV_FILE))
  ios_en_region = environment.fetch(IOS_EN_REGION_KEY, false)
  ios_en_version = environment.fetch(IOS_EN_API_VERSION_KEY, 1)

  update_ios_en_api_version(ios_en_version)
  if ios_en_region
    update_ios_en_region(ios_en_region)
  else
    failure_message "EN region is required"
    exit 1
  end
end


if File.exist?(ENV_FILE)
  update_application_display_name
  puts "✅ Display Names Updated"
  update_bundle_identifiers
  puts "✅ Bundle Identifiers Updated"
  update_ios_configuration
  puts "✅ iOS Configuration Updated"
else
  failure_message "#{ENV_FILE} not found on the root folder, environment file is needed"
  exit 1
end
