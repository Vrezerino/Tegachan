import Joi from 'joi';

export const newPostSchema = Joi.object({
  title: Joi.string().allow(null, '').max(80),
  content: Joi.string().min(1).max(1500).trim().required(),
  thread: Joi.number().allow(null).default(null),
  image: Joi.any(),
  board: Joi.string().required(),
  is_op: Joi.boolean(),
  created_at: Joi.date(),
  recipients: Joi.array(),
  ip: Joi.string(),
  admin: Joi.boolean()
});