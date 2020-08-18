#!/usr/bin/env ruby
#
# Decode a base64 string and save it at android/app/keystore.jks
#
# Usage
#
#   bin/save_keystore.sh <encoded-keystore>

require "base64"

ENCODED_KEYSTORE = ARGV[0]
DECODED_KEYSTORE = Base64.decode64(ENCODED_KEYSTORE)

File.open("android/app/keystore.jks", "w") do |f|
  f.write(DECODED_KEYSTORE)
end
