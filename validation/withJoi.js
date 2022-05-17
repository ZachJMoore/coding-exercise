// slight alteration of https://github.com/codecoolture/next-joi

import { ValidationError } from "joi";

const defaultConfig = {
  onValidationError: (_, res) => res.status(400).end(),
};

const supportedFields = ["body", "headers", "query"];

export default function withJoi(userConfig = {}) {
  const config = { ...defaultConfig, ...userConfig };
  const onValidationError = config.onValidationError;

  return (schemas, handler) => {
    const keys = Object.keys(schemas);
    const fieldsToValidate = keys.filter((field) =>
      supportedFields.includes(field)
    );

    return (req, res, next) => {
      try {
        const values = fieldsToValidate.map((field) => {
          const schema = schemas[field];

          const result = schema
            .required()
            .validate(req[field], config.validationOptions);

          if (result.error) {
            throw result.error;
          }

          return [field, result.value];
        });

        if (config.validationOptions?.convert !== false) {
          values.forEach(([field, value]) => (req[field] = value));
        }
      } catch (error) {
        if (error instanceof ValidationError) {
          return onValidationError(req, res, error);
        }

        throw error;
      }

      if (undefined !== next) {
        return next();
      }

      if (undefined !== handler) {
        return handler(req, res);
      }

      res.status(404).end();
    };
  };
}
