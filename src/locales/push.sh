#!/bin/bash
set -e

# Usage:
#   - Create a READ/WRITE token at https://app.lokalise.com/profile
#   - Run the command from the root of the project with:
#     LOKALISE_READ_WRITE_TOKEN=<token> yarn i18n:push


function found_exe() {
  hash "$1" 2>/dev/null
}

if ! found_exe lokalise2; then
  if [[ "$OSTYPE" == "darwin"* ]]; then

    if ! found_exe brew; then
      echo "You must install homebrew: https://docs.brew.sh/Installation"
      exit 1
    fi
    brew tap lokalise/cli-2
    brew install lokalise2

  else
    curl -sfL https://raw.githubusercontent.com/lokalise/lokalise-cli-2-go/master/install.sh | sh
    export PATH="$PATH:./bin"
  fi
fi

echo "Uploading English base files"
lokalise2 file upload \
  --file=src/locales/en.json,ios/en.lproj/InfoPlist.strings,ios/en.lproj/Localizable.strings,android/app/src/bt/res/values/strings.xml \
  --lang-iso=en \
  --cleanup-mode \
  --replace-modified \
  --include-path \
  --detect-icu-plurals \
  --apply-tm \
  --convert-placeholders \
  --poll \
  --config .lokalise.yml \
  --token=$LOKALISE_READ_WRITE_TOKEN
