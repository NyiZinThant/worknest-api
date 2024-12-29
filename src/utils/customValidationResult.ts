import { validationResult } from 'express-validator';
import { ValidationSubErrorType } from './ValidationError';

const myValidationResult = validationResult.withDefaults<
  ValidationSubErrorType[]
>({
  formatter: (error) => {
    switch (error.type) {
      case 'field': {
        const [message, errorCode] = error.msg.split(',');
        return {
          field: error.path,
          message,
          errorCode,
        };
        break;
      }
      default: {
        return error.msg;
      }
    }
  },
});

export default myValidationResult;
