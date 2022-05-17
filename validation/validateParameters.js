import _ from "lodash";
import withJoi from "./withJoi";

const validateParameters = withJoi({
  onValidationError: (req, res, error) => {
    let errorMessage = _.get(
      error,
      "details[0].message",
      "Invalid request parameters"
    );
    res.status(400).json({
      message: errorMessage,
    });
  },
});

export default validateParameters;
