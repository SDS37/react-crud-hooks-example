import { NavLink } from "react-router";
import PropTypes from "prop-types";

const FocusLink = ({ to, children, ...props }) => (
  <NavLink to={to} {...props}>
    {children}
  </NavLink>
);

FocusLink.propTypes = {
  to: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      pathname: PropTypes.string.isRequired,
      search: PropTypes.string,
    }),
  ]).isRequired,
  children: PropTypes.node.isRequired,
};

export default FocusLink;
