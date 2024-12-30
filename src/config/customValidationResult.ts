import { validationResult } from 'express-validator';
import { ValidationSubErrorType } from '../utils/ValidationError';

const myValidationResult =
  validationResult.withDefaults<ValidationSubErrorType>({
    formatter: (error) => {
      switch (error.type) {
        case 'field': {
          const [message, errorCode] = error.msg.split(',');
          return {
            field: error.path,
            message,
            errorCode,
          };
        }
        default: {
          return error.msg;
        }
      }
    },
  });

export default myValidationResult;
