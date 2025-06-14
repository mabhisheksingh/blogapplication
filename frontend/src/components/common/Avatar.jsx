import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import { PersonFill } from 'react-bootstrap-icons';
import './Avatar.css';

const Avatar = ({
  src,
  alt = 'User Avatar',
  size = 'md',
  className,
  name,
  status,
  statusPosition = 'bottom-right',
  onClick,
  style,
  ...props
}) => {
  const [imageError, setImageError] = React.useState(false);
  const avatarClasses = classNames(
    'avatar',
    `avatar-${size}`,
    {
      'avatar-clickable': onClick,
      [`status-${status}`]: status,
      [`status-pos-${statusPosition}`]: status,
    },
    className
  );

  // Generate initials from name
  const getInitials = () => {
    if (!name) return null;
    
    const names = name.trim().split(/\s+/);
    if (names.length === 1) return names[0].charAt(0).toUpperCase();
    
    return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase();
  };

  // Handle image loading error
  const handleImageError = () => {
    setImageError(true);
  };

  // Render appropriate content based on props
  const renderContent = () => {
    if (src && !imageError) {
      return (
        <img
          src={src}
          alt={alt}
          className="avatar-img"
          onError={handleImageError}
          loading="lazy"
        />
      );
    }
    
    if (name) {
      return <span className="avatar-text">{getInitials()}</span>;
    }
    
    return <PersonFill className="avatar-icon" />;
  };

  // Status indicator
  const renderStatus = () => {
    if (!status) return null;
    
    return (
      <span 
        className={`avatar-status bg-${status === 'online' ? 'success' : 'secondary'}`}
        title={status === 'online' ? 'Online' : 'Offline'}
      />
    );
  };

  return (
    <div 
      className={avatarClasses} 
      onClick={onClick}
      style={style}
      role={onClick ? 'button' : 'img'}
      aria-label={alt}
      tabIndex={onClick ? 0 : -1}
      onKeyDown={(e) => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) {
          e.preventDefault();
          onClick(e);
        }
      }}
      {...props}
    >
      <div className="avatar-inner">
        {renderContent()}
      </div>
      {renderStatus()}
    </div>
  );
};

Avatar.propTypes = {
  /** Image source URL */
  src: PropTypes.string,
  /** Alt text for the avatar image */
  alt: PropTypes.string,
  /** Size of the avatar */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', 'xxl']),
  /** Additional class name */
  className: PropTypes.string,
  /** User's name for generating initials */
  name: PropTypes.string,
  /** Status indicator */
  status: PropTypes.oneOf(['online', 'offline']),
  /** Position of the status indicator */
  statusPosition: PropTypes.oneOf([
    'top-right',
    'top-left',
    'bottom-right',
    'bottom-left',
  ]),
  /** Click handler */
  onClick: PropTypes.func,
  /** Custom styles */
  style: PropTypes.object,
};

// Avatar group component
const AvatarGroup = ({ children, maxCount = 5, size = 'md', className, ...props }) => {
  const avatars = React.Children.toArray(children);
  const totalAvatars = avatars.length;
  const avatarsToShow = maxCount ? avatars.slice(0, maxCount) : avatars;
  const remainingCount = totalAvatars - avatarsToShow.length;

  const avatarGroupClasses = classNames('avatar-group', className);

  return (
    <div className={avatarGroupClasses} {...props}>
      {avatarsToShow.map((avatar, index) => (
        React.cloneElement(avatar, {
          key: index,
          size,
          className: classNames(avatar.props.className, 'avatar-group-item'),
          style: {
            ...avatar.props.style,
            marginLeft: index > 0 ? `-${size === 'sm' ? '10' : '12'}%` : 0,
            zIndex: avatarsToShow.length - index,
            border: '2px solid #fff',
          },
        })
      ))}
      {remainingCount > 0 && (
        <Avatar
          size={size}
          className="avatar-group-more"
          name={`+${remainingCount}`}
          style={{
            marginLeft: `-${size === 'sm' ? '10' : '12'}%`,
            zIndex: avatarsToShow.length + 1,
            border: '2px solid #fff',
          }}
        />
      )}
    </div>
  );
};

AvatarGroup.propTypes = {
  /** Avatar components */
  children: PropTypes.node.isRequired,
  /** Maximum number of avatars to show before showing a count */
  maxCount: PropTypes.number,
  /** Size of the avatars in the group */
  size: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', 'xxl']),
  /** Additional class name */
  className: PropTypes.string,
};

// Attach Group to Avatar
Avatar.Group = AvatarGroup;

export default Avatar;
