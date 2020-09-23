#!/bin/bash
CURRENT_BRANCH= git branch | grep \* | cut -d ' ' -f2

echo "Updating version in current branch..."
git checkout -f master
npm version patch -m "Bump to %s"
git push origin $CURRENT_BRANCH

echo "Creating new release branch..."
VERSION=$(npm run version --silent)
git checkout -b release/$VERSION

react-scripts build
git add .
git commit -m "Release ${VERSION}" --no-verify
git push origin release/$VERSION
git checkout -f master
fm deploy