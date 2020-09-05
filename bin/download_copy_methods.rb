# Utility to fetch the copy json from the configuration repo.
require_relative "./helpers"

COPY_FILE_NAME = "copy.json"
COPY_FILE_PATH = "src/configuration"

def download_copy_file(ha_label, access_token)
  copy_file_url = "https://#{access_token}@raw.githubusercontent.com/Path-Check/pathcheck-mobile-resources/#{mobile_resources_commit}/copy/#{HA_LABEL}/#{COPY_FILE_NAME}"

  file_destination = "#{COPY_FILE_PATH}/#{COPY_FILE_NAME}"

  return true if download_file(file_destination, copy_file_url)

  puts "Failed to download copy file for #{ha_label}"
end
