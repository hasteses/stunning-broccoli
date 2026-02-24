FROM oven/bun:latest

WORKDIR /app

COPY package.json .
COPY bun.lock .
RUN bun install

COPY index.ts .
RUN mkdir -p storage

EXPOSE 8080

CMD ["bun", "start"]