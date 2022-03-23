FROM node:16.14
MAINTAINER yuri2peter@qq.com
COPY . /app/
WORKDIR /app
# VOLUME ["/app/persists/"]
RUN npm run init && rm .env.local && npm run build
EXPOSE 8000
CMD ["npm", "start"]