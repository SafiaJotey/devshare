import { Settings, LucideProps } from "lucide-react";

export const SettingsIcon = ({ className, size = 18, ...props }: LucideProps) => {
  return <Settings className={className} size={size} strokeWidth={2} {...props} />;
};

export default SettingsIcon;