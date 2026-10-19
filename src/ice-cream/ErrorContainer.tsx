import type { ReactNode } from "react";

type ErrorContainerProps = {
  children: ReactNode;
  errorText?: string | null;
  hasSubmitted: boolean;
  errorId: string;
};

const ErrorContainer = ({
  children,
  errorText,
  hasSubmitted,
  errorId,
}: ErrorContainerProps) => (
  <div className={errorText && hasSubmitted ? "error" : undefined}>
    {children}
    <div className="error-wrapper">
      {errorText && hasSubmitted && <span id={errorId}>{errorText}</span>}
    </div>
  </div>
);

export default ErrorContainer;
