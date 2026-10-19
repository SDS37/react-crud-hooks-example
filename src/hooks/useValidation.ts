type FieldError = string | null;

type ValidationProps = {
  "aria-describedby": string | null;
  "aria-invalid": "true" | "false";
  "aria-required": "true" | null;
  required: boolean;
};

type Validator = (value: string, compareValue: boolean | null) => FieldError;

const useValidation = (
  value: string,
  errorId: string,
  showError: boolean,
  validatorFn: Validator,
  isRequired: boolean,
  compareValue: boolean | null = null,
): [FieldError, ValidationProps] => {
  // Derived during render so a submit sees the error for the values on screen.
  // An effect would still be reporting the empty initial state for one frame.
  const error = validatorFn(value, compareValue);

  return [
    error,
    {
      "aria-describedby": error && showError ? errorId : null,
      "aria-invalid": error && showError ? "true" : "false",
      "aria-required": isRequired ? "true" : null,
      required: isRequired,
    },
  ];
};

export default useValidation;
