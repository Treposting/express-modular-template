# Use a Node.js image
FROM node:18.18.0

# Set the working directory
WORKDIR /app

# Copy all the application files
COPY . .

# Install dependencies
RUN yarn install

# Expose the port if required
EXPOSE 5000

# Command to run the application 
CMD ["yarn", "start"]
