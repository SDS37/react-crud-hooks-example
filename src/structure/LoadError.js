import PropTypes from "prop-types";

const LoadError = ({ message }) => <p role="alert">{message}</p>;

LoadError.propTypes = {
  message: PropTypes.string.isRequired,
};

export default LoadError;
