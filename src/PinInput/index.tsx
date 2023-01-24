import React, { useState, useRef, useEffect } from "react";
import { Box, InputBase, InputBaseProps } from "@mui/material";
import { styled } from "@mui/system";

interface PinInputProps {
  handlePinChange: (pin: string) => void;
  length: number;
}

const PinInputContainer = styled("div")(() => ({
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  width: "100%",
  "& input": {
    textAlign: "center",
    width: "20%",
    fontSize: "2rem",
    fontWeight: "bold",
    letterSpacing: "0.5rem",
    border: "1px solid red",
    borderRadius: "10px",
    padding: "5px 15px",
    margin: 0,
    "&::-webkit-outer-spin-button, &::-webkit-inner-spin-button": {
      "-webkit-appearance": "none",
      margin: 0,
    },
    "&[type=number]": {
      "-moz-appearance": "textfield",
    },
  },
}));

const PinInput: React.FC<PinInputProps & InputBaseProps> = ({
  length,
  handlePinChange,
  ...rest
}) => {
  const [pin, setPin] = useState<string[]>(new Array(length).fill(""));
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);
  const firstInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (firstInputRef.current) {
      firstInputRef.current.focus();
    }
  }, []);

  useEffect(() => {
    handlePinChange(pin.join(""));
  }, [pin]);

  const handleKeyDown = (
    event: React.KeyboardEvent<HTMLInputElement>,
    index: number
  ) => {
    if (event.key === "Backspace" && pin[index] === "" && index !== 0) {
      inputsRef.current[index - 1]?.focus();
      setPin((prev) => [...prev.slice(0, index - 1), "", ...prev.slice(index)]);
    }
  };

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
    const { value } = event.target;
    if (/^\d*$/.test(value) && value.length <= 1) {
      setPin((prev) => [
        ...prev.slice(0, index),
        value,
        ...prev.slice(index + 1),
      ]);
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handlePaste = (event: React.ClipboardEvent<HTMLInputElement>) => {
    event.preventDefault();
    const pastedData = event.clipboardData.getData("text").slice(0, length);
    const pastedPin = pastedData
      .split("")
      .map((char) => (/\d/.test(char) ? char : ""))
      .slice(0, length);
    const newPin = [...pin];
    pastedPin.forEach((char, index) => {
      newPin[index] = char;
    });
    setPin(newPin.flat());
  };

  const handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
    event.target.select();
  };

  const handleBlur = (event: React.FocusEvent<HTMLInputElement>) => {
    event.target.setSelectionRange(0, 0);
  };

  return (
    <Box sx={{ display: "inline-block" }}>
      <PinInputContainer>
        {Array.from({ length }).map((_, index) => (
          <InputBase
            key={index}
            inputRef={(el) => {
              inputsRef.current[index] = el;
            }}
            value={pin[index]}
            onKeyDown={(event: React.KeyboardEvent<HTMLInputElement>) =>
              handleKeyDown(event, index)
            }
            onChange={(event: React.ChangeEvent<HTMLInputElement>) =>
              handleChange(event, index)
            }
            onPaste={handlePaste}
            onFocus={handleFocus}
            onBlur={handleBlur}
            {...rest}
          />
        ))}
      </PinInputContainer>
    </Box>
  );
};

export default PinInput;
