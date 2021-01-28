#!/bin/bash
set -e

# Usage:
#   - Create a READ ONLY a token at https://app.lokalise.com/profile
#   - Run the command from the root of the project with:
#     LOKALISE_READ_TOKEN=<token> yarn i18n:pull
#   - To specify which languages do pull add the LANGUAGES with comma separated
#     locale strings:
#     LANGUAGES=en,es_PR,el yarn i18n:pull

function found_exe() {
  hash "$1" 2>/dev/null
}

# Check if lokalise2 is in Path and install if not
# note the executable must be accessible from $PATH
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
  fi
fi

if [ -z "$LANGUAGES" ]; then
  LANGUAGES_FILTER=""
else
  LANGUAGES_FILTER="--filter-langs $LANGUAGES"
fi

echo "Downloading iOS *.strings"
lokalise2 file download \
  --add-newline-eof \
  --export-empty-as=skip \
  --format strings \
  --include-description \
  --original-filenames=false \
  --bundle-structure "%LANG_ISO%.lproj/InfoPlist.strings" \
  --unzip-to=ios \
  --export-sort=a_z \
  --config .lokalise.yml \
  --token=$LOKALISE_READ_TOKEN \
  $LANGUAGES_FILTER

echo "Downloading Android strings.xml"
lokalise2 file download \
  --add-newline-eof \
  --export-empty-as skip \
  --format xml \
  --include-description \
  --original-filenames=false \
  --bundle-structure "values-%LANG_ISO%/strings.xml" \
  --unzip-to=android/app/src/main/res \
  --export-sort=a_z \
  --config .lokalise.yml \
  --token=$LOKALISE_READ_TOKEN \
  $LANGUAGES_FILTER

echo "Downloading i18next *.json files"
lokalise2 file download \
  --add-newline-eof \
  --export-empty-as=skip \
  --format json \
  --include-description \
  --plural-format=i18next \
  --placeholder-format=i18n \
  --export-sort=a_z \
  --replace-breaks=false \
  --bundle-structure "locales/%LANG_ISO%.json" \
  --original-filenames=false \
  --unzip-to=src \
  --indentation=2sp \
  --json-unescaped-slashes \
  --config .lokalise.yml \
  --token=$LOKALISE_READ_TOKEN \
  $LANGUAGES_FILTER
