import Joi from 'joi';
export const listingSchema = Joi.object({
    title:       Joi.string().required(),
    description: Joi.string().required(),
    price:       Joi.number().required(),
    location:    Joi.string().required(),
    country:     Joi.string().required(),
    category:    Joi.string().required()
});

