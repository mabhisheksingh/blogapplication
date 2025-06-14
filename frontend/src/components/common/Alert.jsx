import React from 'react';
import PropTypes from 'prop-types';
import { X, AlertCircle, CheckCircle, AlertTriangle, Info } from 'react-feather';
import classNames from 'classnames';
import './Alert.css';

const Alert = ({
  variant = 'info',
  title,
  message,
  className,
  dismissible = false,
  onDismiss,
  showIcon = true,
  children,
  ...props
}) => {
  const [isVisible, setIsVisible] = React.useState(true);

  const handleDismiss = () => {
    setIsVisible(false);
    if (onDismiss) {
      onDismiss();
    }
  };

  // Don't render if not visible
  if (!isVisible) return null;

  const alertClasses = classNames(
    'alert',
    `alert-${variant}`,
    {
      'alert-dismissible': dismissible,
      'alert-with-icon': showIcon,
    },
    className
  );

  // Get the appropriate icon based on variant
  const getIcon = () => {
    const iconProps = { size: 20, className: 'alert-icon' };
    
    switch (variant) {
      case 'success':
        return <CheckCircle {...iconProps} />;
      case 'danger':
      case 'error':
        return <AlertCircle {...iconProps} />;
      case 'warning':
        return <AlertTriangle {...iconProps} />;
      case 'info':
      default:
        return <Info {...iconProps} />;
    }
  };

  return (
    <div className={alertClasses} role="alert" {...props}>
      <div className="alert-content">
        {showIcon && <div className="alert-icon-container">{getIcon()}</div>}
        <div className="alert-body">
          {title && <h4 className="alert-title">{title}</h4>}
          {message && <div className="alert-message">{message}</div>}
          {children && <div className="alert-children">{children}</div>}
        </div>
      </div>
      {dismissible && (
        <button
          type="button"
          className="alert-close"
          onClick={handleDismiss}
          aria-label="Close"
        >
          <X size={18} />
        </button>
      )}
    </div>
  );
};

Alert.propTypes = {
  /** Alert style variant */
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
  /** Alert title */
  title: PropTypes.string,
  /** Alert message */
  message: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  /** Additional class name */
  className: PropTypes.string,
  /** Show close button */
  dismissible: PropTypes.bool,
  /** Callback when alert is dismissed */
  onDismiss: PropTypes.func,
  /** Show icon */
  showIcon: PropTypes.bool,
  /** Custom content */
  children: PropTypes.node,
};

export default Alert;
