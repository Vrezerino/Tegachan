import Joi from 'joi';

export const newPostSchema = Joi.object({
    title: Joi.string().max(20),
    content: Joi.string().min(1).max(1500).required(),
    image: Joi.any(),
    board: Joi.string().required(),
    replyTo: Joi.number()
})