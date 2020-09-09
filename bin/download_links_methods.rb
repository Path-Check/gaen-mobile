# Utility to fetch the links json from the configuration repo.
require_relative "./helpers"

LINKS_FILE_NAME = "links.json"
LINKS_FILE_PATH = "src/configuration"

def download_links_file(ha_label, access_token)
  copy_file_url = "https://#{access_token}@raw.githubusercontent.com/Path-Check/pathcheck-mobile-resources/#{mobile_resources_commit}/links/#{HA_LABEL}/#{LINKS_FILE_NAME}"

  file_destination = "#{LINKS_FILE_PATH}/#{LINKS_FILE_NAME}"

  return true if download_file(file_destination, copy_file_url)

  puts "Failed to download links file for #{ha_label}"
end
