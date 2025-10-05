import './CSSEarth.css';

/**
 * CSS-based rotating Earth component
 * More reliable than Three.js texture approach
 * @param {Object} props
 * @param {number} props.size - Size in pixels (default: 400)
 * @param {number} props.animationSpeed - Rotation speed in seconds (default: 8)
 * @param {string} props.position - CSS position style (default: 'absolute')
 * @param {string} props.top - CSS top position
 * @param {string} props.left - CSS left position
 * @param {string} props.right - CSS right position
 * @param {string} props.bottom - CSS bottom position
 * @param {number} props.opacity - Opacity 0-1 (default: 1)
 */
export default function CSSEarth({
  size = 400,
  animationSpeed = 8,
  position = 'absolute',
  top,
  left,
  right,
  bottom,
  opacity = 1,
  className = ''
}) {
  const containerStyle = {
    position,
    top,
    left,
    right,
    bottom,
    opacity,
    transform: 'translateZ(0)', // Enable hardware acceleration
  };

  const earthStyle = {
    width: `${size}px`,
    height: `${size}px`,
    animation: `rotate-earth ${animationSpeed}s linear infinite`,
    backgroundSize: `${size * 1.575}px`, // Proportional to original 630px/400px ratio
  };

  const shineStyle = {
    background: `radial-gradient(circle at ${size * 0.25}px ${size * 0.25}px, #fff, #000)`,
  };

  return (
    <div className={`css-earth-container ${className}`} style={containerStyle}>
      <div className="css-earth" style={earthStyle}>
        <div className="css-earth-overlay"></div>
        <div className="css-earth-shine" style={shineStyle}></div>
      </div>
    </div>
  );
}
