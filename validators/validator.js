import {validationResult} from 'express-validator';
import HttpStatus from '../enums/HttpStatusEnum.js';

const validate = (req, res, next) => {
    const errors = validationResult(req);

    if(errors.isEmpty()) return next();

    const extractedErrors = [];
    errors.array().map(err=>
        extractedErrors.push(
            {[err.param]: err.msg}
        ));

    return res.status(HttpStatus.UnprocessableEntity).json({
        errors: extractedErrors,
    });
}

export default validate;