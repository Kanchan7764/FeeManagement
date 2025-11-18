import React from "react";
import { motion } from "framer-motion";

const SummaryCard = ({ icon, text, number, color, subtext }) => {
  return (
    <motion.div
      whileHover={{ scale: 1.05 }}
      transition={{ duration: 0.3 }}
      className={`${color} rounded-2xl p-5 flex flex-col gap-2 shadow-lg`}
    >
      <div className="text-3xl">{icon}</div>
      <h4 className="text-lg font-semibold">{text}</h4>
      <p className="text-2xl font-bold">{number}</p>
      {subtext && <span className="text-sm opacity-80">{subtext}</span>}
    </motion.div>
  );
};

export default SummaryCard;
