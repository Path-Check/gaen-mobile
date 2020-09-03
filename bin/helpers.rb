def url_exists?(remote_url)
  output, _error, status = Open3.capture3(
    "curl", "-I", remote_url
  )
  url_exists = output.split("\n")[0].match("404").to_a.empty?

  return true if status.success? && url_exists

  puts "#{remote_url} could not be found"
  false
end

def download_file(file_name, remote_url)
  return false unless url_exists?(remote_url)

  _output, error, status = Open3.capture3(
    "curl", remote_url, "-L", "-o", file_name
  )
  return true if status.success?

  puts error
  false
end

def delete_folder(path)
  _output, error, status = Open3.capture3("rm", "-rf", path)
  return true if status.success?

  puts error
  false
end

def delete_file(path)
  _output, error, status = Open3.capture3("rm", path)
  return true if status.success?

  puts error
  false
end

def copy_folder(source_path, destination_path)
  _output, error, status = Open3.capture3(
    "cp", "-r", source_path, destination_path
  )
  return true if status.success?

  puts error
  false
end

def copy_file(source_path, destination_path)
  _output, error, status = Open3.capture3("cp", source_path, destination_path)

  return true if status.success?

  puts error
  false
end

def validate_token!(token)
  return if valid_token(token)

  puts "No valid github token set"
  puts "Set a valid token in your .env file"
  exit 1
end

def validate_ha_label!(label, script_name)
  return if label

  puts "No HA label provided"
  puts "provide a label as a parameter e.g. $ bin/#{script_name}.sh pc"
  exit 1
end

def valid_token(token)
  token.length == 40
end

def mobile_resources_commit
  file = File.open("mobile_resources_commit")
  commit = file.read.chomp
  file.close

  commit
end
