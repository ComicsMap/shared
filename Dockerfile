FROM node:24-alpine

ENV NODE_ENV=development

WORKDIR /app
RUN chown node:node /app

USER node

COPY --chown=node:node package*.json ./
RUN npm install --ignore-scripts

COPY --chown=node:node . .

CMD ["tail", "-f", "/dev/null"]