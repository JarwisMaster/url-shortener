import * as Joi from "joi";
import { join } from "path";

export const EnvironmentValidationSchema = Joi.object({
    API_ENV: Joi.string().valid('dev', 'prod', 'test').default('dev'),
    API_PORT: Joi.number().required(),
    
    REQUEST_LOGGER: Joi.boolean().default(false),
    REQUEST_INLINE_LOGGER: Joi.boolean().default(false)
})