#!/bin/bash
# setup.sh
# This script creates the directory structure and files for the study-habits-tracker project.

# Create directories (using -p so it doesn't complain if they already exist)
mkdir -p .github/ISSUE_TEMPLATE
mkdir -p docs
mkdir -p src
mkdir -p tests

# Create files in the corresponding directories.
# The following files will be created if they don't already exist.
# Existing files will not be overwritten.

# .github directory
if [ ! -f ".github/PULL_REQUEST_TEMPLATE.md" ]; then
  touch .github/PULL_REQUEST_TEMPLATE.md
  echo "Created .github/PULL_REQUEST_TEMPLATE.md"
fi

# docs directory
if [ ! -f "docs/CONTRIBUTING.md" ]; then
  touch docs/CONTRIBUTING.md
  echo "Created docs/CONTRIBUTING.md"
fi

if [ ! -f "docs/CODE_OF_CONDUCT.md" ]; then
  touch docs/CODE_OF_CONDUCT.md
  echo "Created docs/CODE_OF_CONDUCT.md"
fi

# Create .gitignore in the root if it doesn't exist
if [ ! -f ".gitignore" ]; then
  touch .gitignore
  echo "Created .gitignore"
fi

# Note: LICENSE and README.md are assumed to already exist in the current directory.

echo "Directory structure setup complete."

