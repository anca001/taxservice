FROM node:22.13.1
COPY . .
RUN npm install
CMD ["npm", "run", "start"]