#!/bin/sh

# Exit script as soon as a command fails.
set -o errexit

if [ "$WITH_COVERAGE" -eq 0 ]; then 
    echo "Running tests without coverage"
    npx mocha --exit --require @babel/register -R spec --timeout 70000 ./tests/spec/**/*.test.js 

else 
    echo "Running tests with coverage"
    npx istanbul cover _mocha --report lcov -- --exit --require @babel/register -R spec --timeout 70000 ./tests/spec/**/*.test.js    
fi
