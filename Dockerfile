FROM mcr.microsoft.com/playwright:v1.52.0-noble

WORKDIR /app

COPY package*.json ./
RUN npm ci
RUN npx playwright install chromium

COPY . .

CMD ["npm", "test"]
