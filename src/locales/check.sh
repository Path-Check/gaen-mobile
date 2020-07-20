# checks for no missing translations in the en.json file.
# this should ensure that keys are always clearly linked via git blame to their
# respective PR

#!/bin/bash
set -e

echo "yarn i18n:extract"
yarn i18n:extract

echo "Checking for blank keys. Correct any that appear in this list:"
! grep "\"\"" src/locales/en.json

echo "Checking EULA HTML is prettier formatted"
./node_modules/.bin/prettier --check src/locales/eula/en.html
