import { Info, LucideProps } from "lucide-react";

export const AboutIcon = ({ className, size = 18, ...props }: LucideProps) => {
  return <Info className={className} size={size} strokeWidth={2} {...props} />;
};

export default AboutIcon;