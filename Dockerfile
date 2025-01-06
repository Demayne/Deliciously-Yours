# Use an official Nginx image to serve static files
FROM nginx:alpine

# Set the working directory inside the container
WORKDIR /usr/share/nginx/html

# Copy all static files and folders into the Nginx HTML directory
COPY . .

# Expose port 80 to make the site accessible
EXPOSE 80

# Default command to run Nginx
CMD ["nginx", "-g", "daemon off;"]
