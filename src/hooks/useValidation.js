const useValidation = (
  value,
  errorId,
  showError,
  validatorFn,
  isRequired,
  compareValue = null,
) => {
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
