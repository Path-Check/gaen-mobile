# Utility to fetch the copy json from the configuration repo.
require_relative "./helpers"

WELCOME_IMAGE_FILE_NAME = "welcomeImage.png"
IMAGE_ASSETS_PATH = "src/assets/images"

def download_welcome_image(ha_label, access_token)
  welcome_image_file_url = "https://#{access_token}@raw.githubusercontent.com/Path-Check/pathcheck-mobile-resources/#{mobile_resources_commit}/assets/#{HA_LABEL}/#{WELCOME_IMAGE_FILE_NAME}"

  if url_exists?(welcome_image_file_url)

    file_destination = "#{IMAGE_ASSETS_PATH}/#{WELCOME_IMAGE_FILE_NAME}"

    return true if download_file(file_destination, welcome_image_file_url)

    puts "Failed to download welcome image file for #{ha_label}"
  else
  end
end
