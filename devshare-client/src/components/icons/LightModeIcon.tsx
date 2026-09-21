import { Sun, LucideProps } from "lucide-react";

export const LightModeIcon = ({ className, size = 18, ...props }: LucideProps) => {
  return <Sun className={className} size={size} strokeWidth={2} {...props} />;
};

export default LightModeIcon;