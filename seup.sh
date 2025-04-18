#!/bin/bash
#Go directory containing the setup.sh file using the cd command
#Make the script executable with chmod +x setup.sh
#Run the script using ./setup.sh 

# Switch to root user
sudo su -

# Install NVM
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash

# Load NVM
export NVM_DIR="$HOME/.nvm"
[ -s "$NVM_DIR/nvm.sh" ] &amp;&amp; \. "$NVM_DIR/nvm.sh"

# Install Node.js
nvm install node

# Print Node.js and npm versions
node -v
npm -v

# Update package lists and install git
apt-get update -y
apt-get install git -y

# Print git version
git --version

# Clone the repository
git clone https://github.com/arrenca/final-project
cd final-project

# Install project dependencies
npm install

# Install additional packages
npm i express dotenv aws-sdk axios