import Joi from 'joi';

export const newPostSchema = Joi.object({
    title: Joi.string().allow(null, '').max(25),
    content: Joi.string().min(1).max(1500).trim().required(),
    thread: Joi.number().allow(null),
    image: Joi.any(),
    board: Joi.string().required(),
    OP: Joi.boolean(),
    date: Joi.date(),
    replies: Joi.array(),
    IP: Joi.string()
});