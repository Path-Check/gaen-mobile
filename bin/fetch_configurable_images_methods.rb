# Utility to fetch the copy json from the configuration repo.
require_relative "./helpers"

ZIP_FILE_NAME = "configurable_images.zip"
IMAGE_ASSETS_PATH = "src/assets/images"
WORKING_DIRECTORY = "working_directory"
ZIP_FILE_DESTINATION = "#{WORKING_DIRECTORY}/#{ZIP_FILE_NAME}"

def download_zip_file_to_working_directory(url)
  return if download_file(ZIP_FILE_DESTINATION, url)

  puts "Could not download zip file"
  exit 1
end

def unzip_to_working_directory
  _output, error, status = Open3.capture3(
    "unzip", ZIP_FILE_DESTINATION, "-d", WORKING_DIRECTORY
  )

  return if status.success? && delete_file(ZIP_FILE_DESTINATION)

  puts "Failed to unzip file #{error}"
  exit 1
end

def copy_images_to_project_folder
  _output, error, status = Open3.capture3(
    "cp", "-a", "#{WORKING_DIRECTORY}/configurable_images/.", IMAGE_ASSETS_PATH
  )

  return if status.success? && delete_folder(WORKING_DIRECTORY)

  puts "Failed to copy images to src folder #{error}"
  exit 1
end

def fetch_configurable_images(ha_label, access_token)
  zip_file_url = "#{resources_base_url(access_token)}/assets/#{ha_label}/#{ZIP_FILE_NAME}"

  unless url_exists?(zip_file_url)
    puts "No image overrides found for #{ha_label}, if this is incorrect please verify the url #{zip_file_url}"
    return true
  end
  Dir.mkdir(WORKING_DIRECTORY)

  download_zip_file_to_working_directory(zip_file_url)
  unzip_to_working_directory
  copy_images_to_project_folder
  puts "Completed downloading assets for #{ha_label}"
end
