const joi = require('joi');

const listingSchema = joi.object({
  title: joi.string().required(),
  description: joi.string().required(),
  price: joi.number().required(),
  location: joi.string().required(),
  country: joi.string().required(),
  category: joi.string().required(),
  lat: joi.number().allow('', null),
  lng: joi.number().allow('', null),
}).unknown(true);

const reviewSchema = joi.object({
  rating: joi.number().required().min(1).max(5),
  comment: joi.string().required().min(4),
});

module.exports = { listingSchema, reviewSchema };
