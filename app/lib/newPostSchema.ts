import Joi from 'joi';

export const newPostSchema = Joi.object({
    title: Joi.string().max(25),
    content: Joi.string().min(1).max(1500).required(),
    image: Joi.any(),
    board: Joi.string().required(),
    replyTo: Joi.array(),
    OP: Joi.boolean(),
    date: Joi.date(),
    IP: Joi.string()
});