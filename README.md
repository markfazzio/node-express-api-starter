## node-express-api-starter

Ever want to get a quick API POC running with some local JSON data? This starter is a quick way to do so, call it an API boilerplate of sorts.

#### Features

- NextJS + Express
- ESLint, Prettier for clean code
- `pnpm`

#### Local Development

Assuming Node >= 18 is installed, run the following shell command:

```
npm i && npm start
```

A server will now be listening at the `API_PORT` which is `8080`. This can be modified in `server.js`. To view the `GET` endpoints in a browser using the sample data, navigate to [http://localhost:8080/api/v1/pokemon/](http://localhost:8080/api/v1/pokemon/) or [http://localhost:8080/api/v1/pokemon/1](http://localhost:8080/api/v1/pokemon/1) once the server is running.
