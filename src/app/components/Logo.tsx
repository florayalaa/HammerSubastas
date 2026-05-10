import logoImage from "../../imports/Logo_-_Oro_sin_fondo.png";

interface LogoProps {
  showText?: boolean;
  className?: string;
  size?: "sm" | "md" | "lg";
}

export function Logo({ showText = true, className = "", size = "md" }: LogoProps) {
  const iconSize = size === "sm" ? 32 : size === "md" ? 40 : 56;
  const textSize = size === "sm" ? "text-xl" : size === "md" ? "text-2xl" : "text-4xl";
  const subtextSize = size === "sm" ? "text-xs" : size === "md" ? "text-sm" : "text-base";

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative">
        <img 
          src={logoImage} 
          alt="Hammer Logo" 
          style={{ width: iconSize, height: iconSize }}
          className="object-contain"
        />
      </div>
      {showText && (
        <div className="flex flex-col">
          <span className={`${textSize} font-bold text-[#333F48] tracking-wide`}>
            HAMMER
          </span>
          <span className={`${subtextSize} text-[#A08C79] uppercase tracking-wider`}>
            Subastas
          </span>
        </div>
      )}
    </div>
  );
}