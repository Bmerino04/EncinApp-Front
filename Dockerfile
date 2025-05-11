FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 19006 19000 19001 8081
CMD ["npm", "start"]
