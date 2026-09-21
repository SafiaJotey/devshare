import { LogIn, LucideProps } from "lucide-react";

export const LoginIcon = ({ className, size = 18, ...props }: LucideProps) => {
  return <LogIn className={className} size={size} strokeWidth={2} {...props} />;
};

export default LoginIcon;