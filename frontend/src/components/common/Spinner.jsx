import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './Spinner.css';

const Spinner = ({
  size = 'md',
  variant = 'primary',
  className,
  centered = false,
  fullScreen = false,
  overlay = false,
  text = 'Loading...',
  showText = false,
  ...props
}) => {
  const spinnerClasses = classNames(
    'spinner',
    `spinner-${size}`,
    `spinner-${variant}`,
    {
      'spinner-centered': centered,
      'spinner-fullscreen': fullScreen,
      'spinner-overlay': overlay,
    },
    className
  );

  const spinnerContent = (
    <div className={spinnerClasses} {...props}>
      <div className="spinner-border" role="status">
        <span className="visually-hidden">{text}</span>
      </div>
      {showText && <div className="spinner-text">{text}</div>}
    </div>
  );

  if (fullScreen) {
    return <div className="spinner-fullscreen-container">{spinnerContent}</div>;
  }

  return spinnerContent;
};

Spinner.propTypes = {
  /** Size of the spinner */
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  /** Color variant */
  variant: PropTypes.oneOf([
    'primary',
    'secondary',
    'success',
    'danger',
    'warning',
    'info',
    'light',
    'dark',
  ]),
  /** Additional class name */
  className: PropTypes.string,
  /** Center the spinner in its container */
  centered: PropTypes.bool,
  /** Display spinner in the center of the screen */
  fullScreen: PropTypes.bool,
  /** Add a semi-transparent overlay */
  overlay: PropTypes.bool,
  /** Loading text (for accessibility) */
  text: PropTypes.string,
  /** Show loading text below the spinner */
  showText: PropTypes.bool,
};

// Spinner with a container for better centering
Spinner.Container = ({
  children,
  className,
  style,
  ...props
}) => (
  <div 
    className={classNames('spinner-container', className)} 
    style={style}
  >
    {children}
  </div>
);

Spinner.Container.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default Spinner;
