import { useRef } from "react";

const OtpInput = ({ value, onChange }) => {
  const inputsRef = useRef([]);

  const handleOtpInput = (e, index) => {
    const val = e.target.value;
    if (!/^[0-9]?$/.test(val)) return;

    const newOtp = [...value];
    newOtp[index] = val;
    onChange(newOtp);

    if (val && index < 5) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace") {
      const newOtp = [...value];
      if (value[index]) {
        newOtp[index] = "";
        onChange(newOtp);
      } else if (index > 0) {
        inputsRef.current[index - 1]?.focus();
      }
    }
  };

  return (
    <div className="flex justify-center gap-2">
      {[...Array(6)].map((_, i) => (
        <input
          key={i}
          ref={(el) => (inputsRef.current[i] = el)}
          type="text"
          maxLength={1}
          value={value[i]}
          onChange={(e) => handleOtpInput(e, i)}
          onKeyDown={(e) => handleKeyDown(e, i)}
          className="w-8 h-10 sm:w-10 sm:h-12 text-center border border-gray-300 bg-white rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 text-lg font-semibold"
        />
      ))}
    </div>
  );
};

export default OtpInput;
