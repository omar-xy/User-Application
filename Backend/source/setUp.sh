#!/bin/bash

# Install dependencies
echo "Installing dependencies..."
npm install

# Generate Prisma client
echo "Generating Prisma client..."
npx prisma generate

# # Run migrations
echo "Running migrations..."
npx prisma migrate dev --name init

# Seed the database
echo "Seeding the database..."
npx ts-node scripts/seed.ts

# Start the backend server
echo "Starting the backend server..."
npx nodemon --exec ts-node src/server.ts