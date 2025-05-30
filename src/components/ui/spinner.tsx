import React from "react";

type SpinnerProps = {
  className?: string;
};

const Spinner: React.FC<SpinnerProps> = ({ className }) => {
  return (
    <div
      className={`h-5 w-5 border-2 border-white border-t-transparent rounded-full animate-spin ${
        className || ""
      }`}
    />
  );
};

export default Spinner;
