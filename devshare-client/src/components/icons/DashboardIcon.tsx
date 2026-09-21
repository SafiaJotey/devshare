import { LayoutDashboard, LucideProps } from "lucide-react";

export const DashboardIcon = ({ className, size = 18, ...props }: LucideProps) => {
  return <LayoutDashboard className={className} size={size} strokeWidth={2} {...props} />;
};

export default DashboardIcon;