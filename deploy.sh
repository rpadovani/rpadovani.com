#!/bin/bash

# The script downlads the last successful build from Gitlab and deploy
# it at the destination path.
# Be sure to run the script from an user with enough permission

# Secret token to use the Gitlab APIs
# See 'Authentication' section here: http://docs.gitlab.com/ce/api/
SECRET_TOKEN=$PERSONAL_TOKEN

# The path where to put the static files
DEST="/usr/share/nginx/html/"

# The path to use as temporary working directory
TMP="/tmp/"

# Where to save the downloaded file
DOWNLOAD_FILE="site.zip";

cd $TMP;
wget --header="PRIVATE-TOKEN: $SECRET_TOKEN" "https://gitlab.com/api/v3/projects/774560/builds/artifacts/master/download?job=deploy_site" -O $DOWNLOAD_FILE;
ls;
unzip $DOWNLOAD_FILE;
cp -r _site/ $DEST/;
rm -rf _site/;
rm $DOWNLOAD_FILE;
