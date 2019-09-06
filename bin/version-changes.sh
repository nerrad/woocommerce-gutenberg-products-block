#!/bin/sh

# replace all instances of $VID:$ with the release version.
find ./src -name "*.php" -print0 | xargs -0 sed -i '' 's/\$VID:\$/'${VERSION}'/g'

# Update version number in readme.txt
sed -i '' -E 's/Stable tag:*.+/Stable tag: '${VERSION}'/' readme.txt

# Update version in main plugin file
sed -i '' -E 's/Version:*.+/Version: '${VERSION}'/' woocommerce-gutenberg-products-block.php

# Update version in package.json
sed -i '' -E 's/"version":*.+/"version": "'${VERSION}'",/' package.json

# Update version in main file
sed -i '' -E "s/VERSION =*.+/VERSION = '${VERSION}';/" src/Package.php
