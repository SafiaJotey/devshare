import { LogOut, LucideProps } from "lucide-react";

export const LogoutIcon = ({ className, size = 18, ...props }: LucideProps) => {
  return <LogOut className={className} size={size} strokeWidth={2} {...props} />;
};

export default LogoutIcon;