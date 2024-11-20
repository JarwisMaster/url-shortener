import * as Joi from "joi";
import { join } from "path";

export const environmentValidationSchema = Joi.object({
    API_ENV: Joi.string().valid('dev', 'prod', 'test').default('dev'),
    API_PORT: Joi.number().required(),

    REQUEST_LOGGER: Joi.boolean().default(false),
    REQUEST_INLINE_LOGGER: Joi.boolean().default(false),

    POSTGRES_HOST: Joi.string().default('localhost'),
    POSTGRES_PORT: Joi.number().default(5432),
    POSTGRES_DATABASE: Joi.string().default('shortener'),
    POSTGRES_USER: Joi.string().default('root'),
    POSTGRES_PASSWORD: Joi.string().default('pass'),
})