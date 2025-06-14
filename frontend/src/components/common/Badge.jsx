import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './Badge.css';

const Badge = ({
  children,
  variant = 'primary',
  size = 'md',
  pill = false,
  className,
  dot = false,
  max = null,
  count = null,
  showZero = false,
  overflowCount = 99,
  offset = [0, 0],
  style,
  ...props
}) => {
  // Handle count display with max and overflow
  const renderContent = () => {
    if (dot) {
      return null;
    }

    if (count !== null) {
      if (count === 0 && !showZero) {
        return null;
      }
      
      const displayCount = count > overflowCount ? `${overflowCount}+` : count;
      return displayCount;
    }

    return children;
  };

  const badgeClasses = classNames(
    'badge',
    `badge-${variant}`,
    `badge-${size}`,
    {
      'badge-pill': pill,
      'badge-dot': dot,
      'badge-count': count !== null,
    },
    className
  );

  // Calculate position for count badges
  const badgeStyle = count !== null ? {
    transform: `translate(${offset[0]}px, ${offset[1]}px)`,
    ...style,
  } : style;

  // Don't render if count is 0 and showZero is false
  if (count === 0 && !showZero && !dot) {
    return null;
  }

  return (
    <span 
      className={badgeClasses} 
      style={badgeStyle}
      {...props}
    >
      {renderContent()}
    </span>
  );
};

Badge.propTypes = {
  /** Badge content */
  children: PropTypes.node,
  /** Badge style variant */
  variant: PropTypes.oneOf([
    'primary',
    'secondary',
    'success',
    'danger',
    'warning',
    'info',
    'light',
    'dark',
    'outline-primary',
    'outline-secondary',
    'outline-success',
    'outline-danger',
    'outline-warning',
    'outline-info',
    'outline-light',
    'outline-dark',
  ]),
  /** Badge size */
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  /** Rounded badge */
  pill: PropTypes.bool,
  /** Additional class name */
  className: PropTypes.string,
  /** Show as a dot without content */
  dot: PropTypes.bool,
  /** Max count to show */
  max: PropTypes.number,
  /** Number to show in badge */
  count: PropTypes.number,
  /** Whether to show badge when count is zero */
  showZero: PropTypes.bool,
  /** Max count to show before showing X+ */
  overflowCount: PropTypes.number,
  /** Offset the badge [x, y] */
  offset: PropTypes.arrayOf(PropTypes.number),
  /** Custom styles */
  style: PropTypes.object,
};

// Badge with count that can be attached to another element
Badge.Count = ({
  count,
  size = 'md',
  variant = 'danger',
  showZero = false,
  overflowCount = 99,
  offset = [0, 0],
  children,
  ...props
}) => {
  if (count === 0 && !showZero) {
    return children || null;
  }

  const displayCount = count > overflowCount ? `${overflowCount}+` : count;
  
  return (
    <span className="badge-wrapper">
      {children}
      <Badge 
        variant={variant}
        size={size}
        count={count}
        showZero={showZero}
        overflowCount={overflowCount}
        offset={offset}
        {...props}
      >
        {displayCount}
      </Badge>
    </span>
  );
};

// Set propTypes for Count component
Badge.Count.propTypes = {
  count: PropTypes.number.isRequired,
  size: PropTypes.oneOf(['sm', 'md', 'lg']),
  variant: PropTypes.string,
  showZero: PropTypes.bool,
  overflowCount: PropTypes.number,
  offset: PropTypes.arrayOf(PropTypes.number),
  children: PropTypes.node,
};

export default Badge;
