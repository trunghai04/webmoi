#!/bin/bash

# MuaSamViet One-Command Installer
# Chạy: curl -sSL https://raw.githubusercontent.com/trunghai04/webmoi/main/install.sh | bash

set -e

echo "🚀 MuaSamViet - One Command Installer"
echo "====================================="

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

log() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

warn() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

step() {
    echo -e "${BLUE}[STEP]${NC} $1"
}

# Check if running from git clone or direct install
if [ -d ".git" ]; then
    log "Detected git repository - running local setup"
    PROJECT_DIR="."
else
    log "Installing MuaSamViet from GitHub..."
    PROJECT_DIR="muasamviet"
    
    # Clone repository
    if [ -d "$PROJECT_DIR" ]; then
        warn "Directory $PROJECT_DIR already exists. Removing..."
        rm -rf "$PROJECT_DIR"
    fi
    
    git clone https://github.com/trunghai04/webmoi.git "$PROJECT_DIR"
    cd "$PROJECT_DIR"
fi

# Check prerequisites
step "Checking prerequisites..."

# Check Node.js
if ! command -v node &> /dev/null; then
    error "Node.js is not installed. Please install Node.js 18+ first."
    echo "Visit: https://nodejs.org/"
    exit 1
fi

NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 18 ]; then
    error "Node.js version 18+ is required. Current version: $(node -v)"
    exit 1
fi
log "Node.js version: $(node -v)"

# Check npm
if ! command -v npm &> /dev/null; then
    error "npm is not installed."
    exit 1
fi
log "npm version: $(npm -v)"

# Check MySQL
if ! command -v mysql &> /dev/null; then
    warn "MySQL is not installed. You'll need to install it manually."
    warn "Visit: https://dev.mysql.com/downloads/mysql/"
else
    log "MySQL found: $(mysql --version)"
fi

# Install dependencies
step "Installing dependencies..."

log "Installing root dependencies..."
npm install

log "Installing backend dependencies..."
cd server
npm install

log "Installing frontend dependencies..."
cd ../client
npm install
cd ..

# Create environment files
step "Setting up environment files..."

if [ ! -f "server/.env" ]; then
    log "Creating server/.env from template..."
    cp server/env.example server/.env
    warn "Please edit server/.env with your database credentials"
else
    log "server/.env already exists"
fi

if [ ! -f "client/.env" ]; then
    log "Creating client/.env from template..."
    cp client/env.example client/.env
else
    log "client/.env already exists"
fi

# Create upload directories
step "Creating upload directories..."

mkdir -p server/src/uploads/avatars
mkdir -p server/src/uploads/products
mkdir -p server/src/uploads/banners
mkdir -p server/src/uploads/general

# Set permissions
chmod -R 755 server/src/uploads

# Database setup
step "Database setup..."

read -p "Do you want to set up the database now? (y/n): " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
    read -p "Enter MySQL root password: " -s MYSQL_ROOT_PASSWORD
    echo
    
    log "Creating database and user..."
    mysql -u root -p"$MYSQL_ROOT_PASSWORD" << EOF
CREATE DATABASE IF NOT EXISTS muasamviet CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'muasamviet_user'@'localhost' IDENTIFIED BY 'muasamviet_password_2024';
GRANT ALL PRIVILEGES ON muasamviet.* TO 'muasamviet_user'@'localhost';
FLUSH PRIVILEGES;
EOF
    
    log "Importing database schema..."
    mysql -u root -p"$MYSQL_ROOT_PASSWORD" muasamviet < muasamviet_database.sql
    
    log "Database setup completed!"
    warn "Database user: muasamviet_user"
    warn "Database password: muasamviet_password_2024"
    warn "Please update server/.env with these credentials"
else
    warn "Database setup skipped. Please set up manually later."
fi

# Create test data
step "Creating test data..."

if [ -f "server/create-test-user.js" ]; then
    cd server
    node create-test-user.js
    cd ..
    log "Test data created successfully!"
else
    warn "Test data script not found"
fi

# Test setup
step "Testing setup..."

if [ -f "test-setup.js" ]; then
    node test-setup.js
else
    log "Setup test script not found"
fi

# Success message
echo
log "🎉 Installation completed successfully!"
echo
log "📝 Next steps:"
echo "1. Edit server/.env with your database credentials"
echo "2. Edit client/.env if needed"
echo "3. Start the application: npm run dev"
echo "4. Access: http://localhost:5173"
echo
log "👥 Default test accounts:"
echo "- Admin: admin@muasamviet.com / 123456"
echo "- User: user1@example.com / 123456"
echo "- Partner: partner1@example.com / 123456"
echo
log "📚 Documentation:"
echo "- Quick Start: QUICK_START.md"
echo "- Full Setup: SETUP_GUIDE.md"
echo "- Social Login: SOCIAL_LOGIN_SETUP.md"
echo
log "🚀 Ready to start development!"

# Ask if user wants to start the app
read -p "Do you want to start the application now? (y/n): " -n 1 -r
echo

if [[ $REPLY =~ ^[Yy]$ ]]; then
    log "Starting MuaSamViet..."
    npm run dev
else
    log "You can start the app later with: npm run dev"
fi
