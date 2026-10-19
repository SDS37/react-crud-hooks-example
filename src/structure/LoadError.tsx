type LoadErrorProps = {
  message: string;
};

const LoadError = ({ message }: LoadErrorProps) => (
  <p role="alert">{message}</p>
);

export default LoadError;
