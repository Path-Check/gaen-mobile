# Utility to fetch the copy json from the configuration repo.
require_relative "./helpers"

COPY_FILE_NAME = "brandColors.ts"
COPY_FILE_PATH = "src/configuration"

def download_brand_colors_file(ha_label, access_token)
  brand_colors_file_url = "https://#{access_token}@raw.githubusercontent.com/Path-Check/pathcheck-mobile-resources/#{mobile_resources_commit}/brand_colors/#{HA_LABEL}/#{COPY_FILE_NAME}"

  if url_exists?(brand_colors_file_url)
    file_destination = "#{COPY_FILE_PATH}/#{COPY_FILE_NAME}"

    return true if download_file(file_destination, copy_file_url)

    puts "Failed to download brand colors file for #{ha_label}"
  else
    puts "Brand colors override for #{HA_LABEL} not present, if this is an error, copy it and try again"

    true
  end
end
