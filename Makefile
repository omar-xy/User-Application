# Makefile

# Start the database
up:
	docker-compose up -d

# Stop the database
down:
	docker-compose down

# Run with the backend setup script 
setup_backend:
	cd Backend/source && chmod +x setUp.sh && chmod 765 usernames.txt && ./setUp.sh \
	
setup_frontend:
	cd Frontend/source && chmod +x setup.sh && ./setup.sh


# Clean up (stop database and remove volumes)
clean:
	docker-compose down -v