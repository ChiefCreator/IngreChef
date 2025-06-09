import { ChefHat } from "lucide-react";
import NoImage from "../NoImage/NoImage";

export default function NoRecipeImage({ className = "" }: { className?: string }) {
  return (
    <NoImage className={className} Icon={ChefHat} />
  );
}