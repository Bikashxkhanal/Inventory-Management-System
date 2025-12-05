import { useRef } from "react";

//for the input box of OTP verification field...
function OtpInput({ otp, setOtp }) {
  const inputRefs = useRef([]);
  const handleChange = (value, index) => {
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < otp.length - 1) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleBackspace = (e, index) => {
    if (!otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  return (
    <>
      {otp.map((digit, index) => (
        <input
          key={index}
          ref={(el) => (inputRefs.current[index] = el)}
          value={digit}
          className="outline-none w-8 h-8 md:w-10 md:h-10 border border-gray-500 text-center  rounded-sm"
          type="text"
          maxLength="1"
          onChange={(e) => handleChange(e.target.value, index)}
          onKeyDown={(e) => e.key === "Backspace" && handleBackspace(e, index)}
        />
      ))}
    </>
  );
}

export default OtpInput;
