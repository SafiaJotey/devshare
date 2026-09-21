import { User, LucideProps } from "lucide-react";

export const ProfileIcon = ({ className, size = 18, ...props }: LucideProps) => {
  return <User className={className} size={size} strokeWidth={2} {...props} />;
};

export default ProfileIcon;