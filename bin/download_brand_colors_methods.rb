# Utility to fetch the copy json from the configuration repo.
require_relative "./helpers"

BRAND_COLORS_FILE_NAME = "brandColors.ts"
BRAND_COLORS_FILE_PATH = "config"

def download_brand_colors_file(ha_label, access_token)
  puts "🛠 FetchingBrand Colors:"

  brand_colors_file_url = "https://#{access_token}@raw.githubusercontent.com/Path-Check/pathcheck-mobile-resources/#{mobile_resources_commit}/brand_colors/#{HA_LABEL}/#{BRAND_COLORS_FILE_NAME}"

  if url_exists?(brand_colors_file_url)
    file_destination = "#{BRAND_COLORS_FILE_PATH}/#{BRAND_COLORS_FILE_NAME}"

    if download_file(file_destination, brand_colors_file_url)
      puts "✅ Done"
    else
      puts "Failed to download brand colors file for #{ha_label}"
      puts "✅ Done"
    end
  else
    puts "No brand colors to override"
    puts "✅ Done"
    true
  end
end
