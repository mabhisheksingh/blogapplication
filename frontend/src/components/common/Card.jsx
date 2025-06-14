import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import './Card.css';

const Card = ({
  children,
  className,
  title,
  subtitle,
  header,
  footer,
  hoverable = false,
  shadow = 'sm',
  border = true,
  ...props
}) => {
  const cardClasses = classNames(
    'card',
    {
      'card-hoverable': hoverable,
      'card-no-border': !border,
      [`card-shadow-${shadow}`]: shadow,
    },
    className
  );

  return (
    <div className={cardClasses} {...props}>
      {header && (
        <div className="card-header">
          {typeof header === 'string' ? (
            <>
              {title && <h3 className="card-title">{title}</h3>}
              {subtitle && <div className="card-subtitle">{subtitle}</div>}
            </>
          ) : (
            header
          )}
        </div>
      )}
      
      {!header && (title || subtitle) && (
        <div className="card-header">
          {title && <h3 className="card-title">{title}</h3>}
          {subtitle && <div className="card-subtitle">{subtitle}</div>}
        </div>
      )}
      
      <div className="card-body">
        {children}
      </div>
      
      {footer && (
        <div className="card-footer">
          {footer}
        </div>
      )}
    </div>
  );
};

Card.propTypes = {
  /** Card content */
  children: PropTypes.node.isRequired,
  /** Additional class name */
  className: PropTypes.string,
  /** Card title */
  title: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
  ]),
  /** Card subtitle */
  subtitle: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.node,
  ]),
  /** Custom header content (overrides title/subtitle) */
  header: PropTypes.node,
  /** Footer content */
  footer: PropTypes.node,
  /** Enable hover effect */
  hoverable: PropTypes.bool,
  /** Shadow size */
  shadow: PropTypes.oneOf(['none', 'sm', 'md', 'lg']),
  /** Show border */
  border: PropTypes.bool,
};

// Card components for composition
const CardHeader = ({ children, className, ...props }) => (
  <div className={classNames('card-header', className)} {...props}>
    {children}
  </div>
);

CardHeader.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

const CardBody = ({ children, className, ...props }) => (
  <div className={classNames('card-body', className)} {...props}>
    {children}
  </div>
);

CardBody.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

const CardFooter = ({ children, className, ...props }) => (
  <div className={classNames('card-footer', className)} {...props}>
    {children}
  </div>
);

CardFooter.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
};

// Attach subcomponents to Card
Card.Header = CardHeader;
Card.Body = CardBody;
Card.Footer = CardFooter;

export default Card;
