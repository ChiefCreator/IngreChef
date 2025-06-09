import { User2 } from "lucide-react";
import NoImage from "../NoImage/NoImage";

export default function NoUserImage({ className = "", size }: { className?: string, size?: string }) {
  return (
    <NoImage className={className} Icon={User2} size={size} />
  );
}