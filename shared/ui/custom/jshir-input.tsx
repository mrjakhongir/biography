"use client";

import { forwardRef, useId } from "react";
import type { FieldError } from "react-hook-form";
import { withMask } from "use-mask-input";
import { InputGroup, InputGroupInput } from "@/shared/ui/input-group";

type Properties = {
  value?: string;
  onChange?: (value: string) => void;
  error?: FieldError;
  disabled?: boolean;
};

const JshirNumberInput = forwardRef<HTMLInputElement, Properties>(({ value, onChange, error, disabled }, reference) => {
  const id = useId();
  return (
    <div className="w-full">
      <InputGroup>
        <InputGroupInput
          id={id}
          type="text"
          placeholder="JSHIR (14 ta raqamdan iborat)"
          value={value}
          onChange={(event) => onChange?.(event.target.value)}
          ref={(element) => {
            withMask("99999999999999", {
              placeholder: "•",
              showMaskOnHover: false,
            })(element);

            if (typeof reference === "function") reference(element);
            else if (reference) reference.current = element;
          }}
          autoComplete="off"
          aria-invalid={error ? "true" : "false"}
          readOnly={disabled}
        />
      </InputGroup>
    </div>
  );
});

JshirNumberInput.displayName = "JshirNumberInput";

export default JshirNumberInput;
