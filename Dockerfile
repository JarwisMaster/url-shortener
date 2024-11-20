ARG APP_BASE_IMAGE=bitnami/node:18.19.0

FROM $APP_BASE_IMAGE AS build

WORKDIR /app

COPY package.json ./
COPY yarn.lock ./

RUN yarn install --frozen-lockfile

COPY ./src ./src
COPY ./tsconfig.json ./
COPY ./tsconfig.build.json ./

RUN yarn run build

# deploymnet image
FROM $APP_BASE_IMAGE AS app

WORKDIR /app

COPY --from=build /app/node_modules ./node_modules
COPY --from=build /app/dist/ .

EXPOSE 8080

ENTRYPOINT ["node", "main.js"]