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
DOWNLOAD_FILE="frontend.zip";

cd $TMP;
wget --header="PRIVATE-TOKEN: $SECRET_TOKEN" "https://gitlab.com/api/v3/projects/774560/builds/artifacts/master/download?job=deploy" -O $DOWNLOAD_FILE;
ls;
unzip $DOWNLOAD_FILE;
rm -rf $DEST;
cp -r dist/ $DEST;
rm -rf dist/;
rm $DOWNLOAD_FILE;
