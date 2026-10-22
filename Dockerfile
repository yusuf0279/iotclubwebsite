FROM node:22-slim
WORKDIR /app
COPY package.json package-lock.json* npm-shrinkwrap.json* yarn.lock* .yarnrc.yml* pnpm-lock.yaml* .npmrc* ./
RUN npm ci
COPY . .
RUN npm run build
ENV NODE_ENV=production PORT=3000 HOST=0.0.0.0 HOSTNAME=0.0.0.0
EXPOSE 3000
CMD ["sh", "-c", "exec npm start"]
