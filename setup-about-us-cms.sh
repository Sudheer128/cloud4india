#!/bin/bash

# Quick setup script for About Us CMS
# This will create the database tables for About Us page

echo "🚀 Setting up About Us CMS..."

# Check if we're in the right directory
if [ ! -f "cloud4india-cms/create-about-us-tables.js" ]; then
    echo "❌ Error: create-about-us-tables.js not found"
    echo "Please run this script from the project root directory"
    exit 1
fi

# Run the migration script
echo "📊 Creating database tables..."
cd cloud4india-cms
node create-about-us-tables.js

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ About Us CMS tables created successfully!"
    echo ""
    echo "🌐 Next steps:"
    echo "1. Restart the CMS service (if running):"
    echo "   docker-compose restart cloud4india-cms"
    echo ""
    echo "2. Access admin panel:"
    echo "   http://149.13.60.6/login"
    echo "   Username: admin"
    echo "   Password: admin123"
    echo ""
    echo "3. Navigate to About Us admin:"
    echo "   http://149.13.60.6/admin/about-us"
    echo ""
    echo "4. Visit About Us page:"
    echo "   http://149.13.60.6/about"
    echo ""
else
    echo "❌ Error creating tables. Please check the error messages above."
    exit 1
fi




