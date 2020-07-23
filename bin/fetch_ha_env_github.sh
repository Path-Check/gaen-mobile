#!/usr/bin/env ruby
#
# Fetch Health Authority Specific Environment for github actions
#

require "open3"

ACCESS_TOKEN = ARGV[0]

def fetch_env
  source = ".env.bt"
  google_service_source = "ios/GoogleService-Info.plist"

  env_url =
  "https://#{ACCESS_TOKEN}@raw.githubusercontent.com/Path-Check/pathcheck-mobile-resources/master/environment/github/.env.bt"

  google_service_url =
  "https://#{ACCESS_TOKEN}@raw.githubusercontent.com/Path-Check/pathcheck-mobile-resources/master/firebase/github/GoogleService-Info.plist"

  fetch_and_write_file(source, env_url)
  fetch_and_write_file(google_service_source, google_service_url)
end

def fetch_and_write_file(filename, remote_url)
  open(filename, 'w') do |f|
    Open3.popen2e("curl", "-f", "-s", remote_url) do |_, stdout_and_err, wait_thr|
      if wait_thr.value.exitstatus != 0
        abort("Fetch failed")
      end
      stdout_and_err.each do |line|
        f << line
      end
      wait_thr.value
    end
  end
end

fetch_env
