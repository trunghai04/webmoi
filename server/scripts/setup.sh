#!/bin/bash

# MuaSamViet Setup Script
# This script automates the setup process for the MuaSamViet project

set -e

echo "🚀 Starting MuaSamViet Setup..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}[INFO]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if Node.js is installed
check_node() {
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 18+ first."
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
    if [ "$NODE_VERSION" -lt 18 ]; then
        print_error "Node.js version 18+ is required. Current version: $(node -v)"
        exit 1
    fi
    
    print_status "Node.js version: $(node -v)"
}

# Check if MySQL is installed
check_mysql() {
    if ! command -v mysql &> /dev/null; then
        print_warning "MySQL is not installed. Please install MySQL 8.0+ first."
        print_warning "You can continue with the setup and configure database later."
    else
        print_status "MySQL found: $(mysql --version)"
    fi
}

# Install backend dependencies
setup_backend() {
    print_status "Setting up backend..."
    
    cd server
    
    # Install dependencies
    print_status "Installing backend dependencies..."
    npm install
    
    # Create .env file if it doesn't exist
    if [ ! -f .env ]; then
        print_status "Creating .env file from template..."
        cp env.example .env
        print_warning "Please edit server/.env with your database credentials"
    fi
    
    # Create upload directories
    print_status "Creating upload directories..."
    mkdir -p src/uploads/avatars
    mkdir -p src/uploads/products
    mkdir -p src/uploads/banners
    mkdir -p src/uploads/general
    
    # Set permissions
    chmod -R 755 src/uploads
    
    cd ..
}

# Install frontend dependencies
setup_frontend() {
    print_status "Setting up frontend..."
    
    cd client
    
    # Install dependencies
    print_status "Installing frontend dependencies..."
    npm install
    
    # Create .env file if it doesn't exist
    if [ ! -f .env ]; then
        print_status "Creating .env file from template..."
        cp env.example .env
    fi
    
    cd ..
}

# Setup database
setup_database() {
    print_status "Setting up database..."
    
    read -p "Do you want to set up the database now? (y/n): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        read -p "Enter MySQL root password: " -s MYSQL_ROOT_PASSWORD
        echo
        
        # Create database and user
        mysql -u root -p"$MYSQL_ROOT_PASSWORD" << EOF
CREATE DATABASE IF NOT EXISTS muasamviet CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER IF NOT EXISTS 'muasamviet_user'@'localhost' IDENTIFIED BY 'muasamviet_password_2024';
GRANT ALL PRIVILEGES ON muasamviet.* TO 'muasamviet_user'@'localhost';
FLUSH PRIVILEGES;
EOF
        
        # Import schema
        mysql -u root -p"$MYSQL_ROOT_PASSWORD" muasamviet < muasamviet_database.sql
        
        print_status "Database setup completed!"
        print_warning "Database user: muasamviet_user"
        print_warning "Database password: muasamviet_password_2024"
        print_warning "Please update server/.env with these credentials"
    else
        print_warning "Database setup skipped. Please set up manually later."
    fi
}

# Create test data
create_test_data() {
    print_status "Creating test data..."
    
    cd server
    
    if [ -f create-test-user.js ]; then
        node create-test-user.js
        print_status "Test data created successfully!"
    else
        print_warning "Test data script not found"
    fi
    
    cd ..
}

# Main setup function
main() {
    print_status "MuaSamViet Setup Script"
    print_status "========================"
    
    # Check prerequisites
    check_node
    check_mysql
    
    # Setup backend
    setup_backend
    
    # Setup frontend
    setup_frontend
    
    # Setup database
    setup_database
    
    # Create test data
    create_test_data
    
    print_status "Setup completed successfully!"
    echo
    print_status "Next steps:"
    echo "1. Edit server/.env with your database credentials"
    echo "2. Edit client/.env if needed"
    echo "3. Start the backend: cd server && npm run dev"
    echo "4. Start the frontend: cd client && npm run dev"
    echo "5. Access the application at http://localhost:5173"
    echo
    print_status "Default test accounts:"
    echo "- Admin: admin@muasamviet.com / 123456"
    echo "- User: user1@example.com / 123456"
    echo "- Partner: partner1@example.com / 123456"
}

# Run main function
main "$@"
