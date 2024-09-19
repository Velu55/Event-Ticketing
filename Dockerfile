# Use an official Node.js runtime as a parent image
FROM node:22

# Define build arguments
ARG DATABASE_URL
ARG SESSION_SECRET
ARG JWT_SECRET
ARG JWT_EXPIRY

# Set environment variables
ENV DATABASE_URL=${DATABASE_URL}
ENV SESSION_SECRET=${SESSION_SECRET}
ENV JWT_SECRET=${JWT_SECRET}
ENV JWT_EXPIRY=${JWT_EXPIRY}

# Set the working directory in the container
WORKDIR /Event_Ticketing

# Copy package.json and package-lock.json (or yarn.lock)
COPY package*.json ./

# Install dependencies
RUN npm install --force

# Copy the rest of the application code
COPY . .

# Install TypeScript globally (if necessary) and compile TypeScript
RUN npm install -g typescript
RUN npm run build

# Expose the port that your application will run on
EXPOSE 3000

# Run the application
CMD ["npm", "start"]

