#!/bin/bash

      # Remove build artifacts
      rm -rf ./dist
      rm -rf ./ios
      rm -rf ./android

      # Clear Metro bundler cache
      rm -rf $TMPDIR/metro-*

      # Clear Expo cache
      expo r -c

      # Reinstall dependencies
      rm -rf node_modules
      rm package-lock.json  # or yarn.lock if you use Yarn
      npm install  # or yarn install

      # Rebuild the project
      expo prebuild
      expo build:ios
      expo build:android

      echo "Clean build complete. Check for any errors in the build process."