import React from 'react';
import PropTypes from 'prop-types';
import { Spinner } from 'react-bootstrap';
import classNames from 'classnames';
import './Button.css';

const Button = ({
  children,
  variant = 'primary',
  size = 'md',
  isLoading = false,
  loadingText = 'Loading...',
  disabled = false,
  fullWidth = false,
  startIcon: StartIcon,
  endIcon: EndIcon,
  className,
  ...props
}) => {
  const buttonClasses = classNames(
    'btn',
    `btn-${variant}`,
    `btn-${size}`,
    {
      'btn-loading': isLoading,
      'btn-full-width': fullWidth,
      'btn-icon': StartIcon || EndIcon,
    },
    className
  );

  return (
    <button
      className={buttonClasses}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading && (
        <span className="btn-spinner">
          <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
          {loadingText && <span className="btn-loading-text">{loadingText}</span>}
        </span>
      )}
      
      {!isLoading && (
        <>
          {StartIcon && <span className="btn-icon-start"><StartIcon /></span>}
          {children}
          {EndIcon && <span className="btn-icon-end"><EndIcon /></span>}
        </>
      )}
    </button>
  );
};

Button.propTypes = {
  /** Button content */
  children: PropTypes.node.isRequired,
  /** Button style variant */
  variant: PropTypes.oneOf([
    'primary',
    'secondary',
    'success',
    'danger',
    'warning',
    'info',
    'light',
    'dark',
    'link',
    'outline-primary',
    'outline-secondary',
    'outline-success',
    'outline-danger',
    'outline-warning',
    'outline-info',
    'outline-light',
    'outline-dark',
  ]),
  /** Button size */
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  /** Show loading spinner */
  isLoading: PropTypes.bool,
  /** Loading text (only shown when isLoading is true) */
  loadingText: PropTypes.string,
  /** Disable the button */
  disabled: PropTypes.bool,
  /** Make button take full width of its container */
  fullWidth: PropTypes.bool,
  /** Icon component to render at the start of the button */
  startIcon: PropTypes.elementType,
  /** Icon component to render at the end of the button */
  endIcon: PropTypes.elementType,
  /** Additional class names */
  className: PropTypes.string,
  /** Click handler */
  onClick: PropTypes.func,
  /** Button type attribute */
  type: PropTypes.oneOf(['button', 'submit', 'reset']),
};

Button.defaultProps = {
  variant: 'primary',
  size: 'md',
  isLoading: false,
  loadingText: 'Loading...',
  disabled: false,
  fullWidth: false,
  type: 'button',
};

export default Button;
