# codespaces-blank

To install bun:
```
curl -fsSL https://bun.sh/install | bash
```

To install dependencies:

```bash
bun install
```

To run:

```bash
bun run index.ts
```

Dockerize:
```
docker build -t something .
docker run -p 8080:8080 -v ./storage:/app/storage something
```

This project was created using `bun init` in bun v1.3.9. [Bun](https://bun.com) is a fast all-in-one JavaScript runtime.
