import Joi from 'joi';

export const newPostSchema = Joi.object({
  title: Joi.string().allow(null, '').max(80),
  name: Joi.string().allow(null, '').max(30),
  content: Joi.alternatives().conditional('image', {
    is: Joi.exist(),
    then: Joi.string().allow('').optional().trim().max(1500),
    otherwise: Joi.string().min(1).max(1500).trim().required()
  }),
  thread: Joi.number().allow(null).default(null),
  image: Joi.any().optional(),
  board: Joi.string().required(),
  is_op: Joi.boolean().required(),
  created_at: Joi.date().required(),
  recipients: Joi.array().required(),
  ip: Joi.string().required(),
  admin: Joi.boolean().required(),
  country_name: Joi.string().required(),
  country_code: Joi.string().max(2).required()
});