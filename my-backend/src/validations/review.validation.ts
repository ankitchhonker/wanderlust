import Joi from 'joi';

export const reviewSchema = Joi.object({
    rating:Joi.number().min(1).max(5).required(),
    comment:Joi.string().required(),
})