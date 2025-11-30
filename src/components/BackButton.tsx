import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";

export const BackButton = () => {
  const navigate = useNavigate();

  return (
    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
      <Button
        variant="ghost"
        size="sm"
        onClick={() => navigate(-1)}
        className="rounded-full"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Go Back
      </Button>
    </motion.div>
  );
};
