#!/bin/bash

if [ ! -f "$(command -v tweego)" ]; then
	echo "Cannot find tweego. Please install tweego before compiling."
	exit 1
fi

VERSION="$(git describe --tags --always --dirty)"

TWEEGO_PATH="./StoryFormats" tweego -o "Degrees of Lewdity $VERSION.html" game
cp "Degrees of Lewdity $VERSION.html" "Degrees of Lewdity.html"
echo "Done: \"Degrees of Lewdity.html\""
