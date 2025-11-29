#!/bin/bash

# Run About Us CMS migration inside Docker container
# This will create the database tables for About Us page

echo "🚀 Setting up About Us CMS in Docker container..."

# Check if Docker container is running
if ! docker ps | grep -q cloud4india-cms; then
    echo "❌ Error: cloud4india-cms container is not running"
    echo "Please start the services first: docker-compose up -d"
    exit 1
fi

# Copy the migration script to the container if needed
echo "📊 Creating database tables in container..."

# Copy the migration script to the container first
docker cp cloud4india-cms/create-about-us-tables.js cloud4india-cms:/app/create-about-us-tables.js

# Run the migration script inside the container
docker exec cloud4india-cms node /app/create-about-us-tables.js

if [ $? -eq 0 ]; then
    echo ""
    echo "✅ About Us CMS tables created successfully!"
    echo ""
    echo "🌐 Next steps:"
    echo "1. Access admin panel:"
    echo "   http://149.13.60.6/login"
    echo "   Username: admin"
    echo "   Password: admin123"
    echo ""
    echo "2. Navigate to About Us admin:"
    echo "   http://149.13.60.6/admin/about-us"
    echo ""
    echo "3. Visit About Us page:"
    echo "   http://149.13.60.6/about"
    echo ""
    echo "✅ All About Us content is now managed via CMS!"
else
    echo "❌ Error creating tables. Please check the error messages above."
    exit 1
fi

