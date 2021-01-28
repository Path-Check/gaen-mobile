# Utility to fetch all configurable images from the configuration repo.

require_relative "./helpers"

ZIP_FILE_NAME = "configurable_images.zip"
IMAGE_ASSETS_PATH = "src/assets/images"
WORKING_DIRECTORY = "working_directory"
ZIP_FILE_DESTINATION = "#{WORKING_DIRECTORY}/#{ZIP_FILE_NAME}"
EXTRACTED_IMAGES_FOLDER = "#{WORKING_DIRECTORY}/configurable_images/"

def download_zip_file_to_working_directory(url)
  return if download_file(ZIP_FILE_DESTINATION, url)

  print_error "Could not download #{ZIP_FILE_NAME}"
  exit 1
end

def unzip_to_working_directory
  _output, error, status = Open3.capture3(
    "unzip", ZIP_FILE_DESTINATION, "-d", WORKING_DIRECTORY
  )

  return if status.success? && delete_file(ZIP_FILE_DESTINATION)

  print_error "Failed to unzip file #{error}"
  exit 1
end

def overridable_images
  files_on_images_asset_path = Dir["#{IMAGE_ASSETS_PATH}/*"].select do |f|
    File.file?(f)
  end
  files_on_images_asset_path.map { |file| file.split("/")[-1] }
end

def extracted_images
  extracted_files = Dir["#{EXTRACTED_IMAGES_FOLDER}/*"].select do |f|
    File.file?(f)
  end
  extracted_files.map { |file| file.split("/")[-1] }
end

def run_diagnosis
  no_match_overrides = extracted_images - overridable_images
  no_match_overrides.each do |no_match_file_name|
    message = "Downloaded #{no_match_file_name} has no match locally. The "\
      "image will be ignored but this probably means that the #{ZIP_FILE_NAME}"\
      "contents are outdated. Please review the #{ZIP_FILE_NAME}"
    print_error(message)
  end
end

def copy_images_to_project_folder
  run_diagnosis
  _output, error, status = Open3.capture3(
    "cp", "-a", "#{EXTRACTED_IMAGES_FOLDER}.", IMAGE_ASSETS_PATH
  )

  return if status.success? && delete_folder(WORKING_DIRECTORY)

  print_error "Failed to copy images to src folder #{error}"
  exit 1
end

def fetch_configurable_images(ha_label, access_token)
  puts ""
  puts "🛠 FetchingConfigurable Images:"

  zip_file_url = "#{resources_base_url(access_token)}/assets/#{ha_label}/#{ZIP_FILE_NAME}"

  unless url_exists?(zip_file_url)
    print_error "No image overrides found for #{ha_label}, if this is incorrect please verify the url #{zip_file_url}"
    return true
  end
  Dir.mkdir(WORKING_DIRECTORY)

  download_zip_file_to_working_directory(zip_file_url)
  print "."
  unzip_to_working_directory
  print "."
  copy_images_to_project_folder
  print "."

  puts ""
  puts "✅ Done"
end
