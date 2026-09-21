import { Moon, LucideProps } from "lucide-react";

export const DarkModeIcon = ({ className, size = 18, ...props }: LucideProps) => {
  return <Moon className={className} size={size} strokeWidth={2} {...props} />;
};

export default DarkModeIcon;