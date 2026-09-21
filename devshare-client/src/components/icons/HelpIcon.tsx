import { HelpCircle, LucideProps } from "lucide-react";

export const HelpIcon = ({ className, size = 18, ...props }: LucideProps) => {
  return <HelpCircle className={className} size={size} strokeWidth={2} {...props} />;
};

export default HelpIcon;