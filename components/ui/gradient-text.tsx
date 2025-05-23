// GradientText.jsx
import "./gradient-text.css"

export function GradientText({
  children,
  className = "",
  colors = ["#FFFFFF", "#FF6EC7", "#6C5CE7", "#3A86FF", "#FFFFFF"],
  animationSpeed = 3, // Faster animation speed (2 seconds)
  showBorder = false,
  textShadow = "0 2px 4px", // Subtle shadow for readability
}) {
  const gradientStyle = {
    backgroundImage: `linear-gradient(to right, ${colors.join(", ")})`,
    animationDuration: `${animationSpeed}s`,
    textShadow,
  }

  return (
    <span className={`animated-gradient-text ${className}`}>
      {showBorder && <span className="gradient-overlay" style={gradientStyle}></span>}
      <span className="text-content" style={gradientStyle}>
        {children}
      </span>
    </span>
  )
}
