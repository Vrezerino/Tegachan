import Joi from 'joi';

export const newPostSchema = Joi.object({
  title: Joi.string().allow(null, '').max(80),
  name: Joi.string().allow(null, '').max(30),
  content: Joi.string().min(1).max(1500).trim().required(),
  thread: Joi.number().allow(null).default(null),
  image: Joi.any(),
  board: Joi.string().required(),
  is_op: Joi.boolean(),
  created_at: Joi.date(),
  recipients: Joi.array(),
  ip: Joi.string(),
  admin: Joi.boolean(),
  country_name: Joi.string(),
  country_code: Joi.string().max(2)
});