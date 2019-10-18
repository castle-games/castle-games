#!/bin/sh
# 
# Notarize an existing Castle app

set -e

if [ -z "$1" ]
then
    echo "usage: notarize-archive.sh castle-app-path"
    exit 1
fi

APP_PATH=$1
ZIP_PATH=castle-notarize.zip

echo "Zipping binary for notarization..."
ditto -c -k --sequesterRsrc --keepParent $APP_PATH $ZIP_PATH

ARTIFACTS_PATH=/tmp/castle-notarize-artifacts
mkdir -p $ARTIFACTS_PATH

echo "Uploading binary to Apple:"
echo "altool --notarize-app -f $ZIP_PATH ..."

UPLOAD_REQUEST_PLIST=$ARTIFACTS_PATH/notarize-upload-request.plist
NOTARIZE_RESULT_PLIST=$ARTIFACTS_PATH/notarize-result.plist

xcrun altool --notarize-app -t osx -f $ZIP_PATH --primary-bundle-id "games.castle.release.desktop" -u "$APPLE_ID_NOTARIZE_USERNAME" -p "$APPLE_ID_NOTARIZE_PASSWORD" --output-format xml > $UPLOAD_REQUEST_PLIST

NOTARIZE_REQUEST_UUID=`/usr/libexec/PlistBuddy -c "Print :notarization-upload:RequestUUID" $UPLOAD_REQUEST_PLIST`

echo "Uploaded binary to Apple: Request UUID is $NOTARIZE_REQUEST_UUID"
sleep 15

NOTARIZATION_STATUS=""
while true; do
    echo "Waiting for notarization to finish..."
    xcrun altool --notarization-info "$NOTARIZE_REQUEST_UUID" -u "$APPLE_ID_NOTARIZE_USERNAME" -p "$APPLE_ID_NOTARIZE_PASSWORD" --output-format xml > $NOTARIZE_RESULT_PLIST
    NOTARIZATION_STATUS=`/usr/libexec/PlistBuddy -c "Print :notarization-info:Status" $NOTARIZE_RESULT_PLIST`
    if [ "$NOTARIZATION_STATUS" != "in progress" ]; then
      break
    fi
    sleep 60
done

if [ "$NOTARIZATION_STATUS" != "success" ]; then
    echo "Notarization failed:"
    cat $NOTARIZE_RESULT_PLIST
    exit 1
fi

echo "Notarization succeeded, downloading log file..."
NOTARIZE_LOG_FILE=$ARTIFACTS_PATH/notarize-log.txt
NOTARIZE_LOG_FILE_URL=`/usr/libexec/PlistBuddy -c "Print :notarization-info:LogFileURL" $NOTARIZE_RESULT_PLIST`

curl -k $NOTARIZE_LOG_FILE_URL -o $NOTARIZE_LOG_FILE

echo "Stapling notarization..."
echo "stapler staple $APP_PATH"
xcrun stapler staple "$APP_PATH"

exit 0
