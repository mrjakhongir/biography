"use client";

import { Phone } from "lucide-react";
import { forwardRef, useId } from "react";
import type { FieldError } from "react-hook-form";
import { withMask } from "use-mask-input";
import { InputGroup, InputGroupAddon, InputGroupInput } from "@/shared/ui/input-group";

type Properties = {
  value?: string;
  onChange?: (value: string) => void;
  error?: FieldError;
  disabled?: boolean;
};

const PhoneNumberInput = forwardRef<HTMLInputElement, Properties>(({ value, onChange, error, disabled }, reference) => {
  const id = useId();
  return (
    <div className="w-full">
      <InputGroup>
        <InputGroupInput
          id={id}
          type="text"
          placeholder="+998 (93) 313 88 99"
          value={value}
          onChange={(event) => onChange?.(event.target.value)}
          ref={(element) => {
            withMask("+\\9\\9\\8 (99) 999 99 99", {
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

        <InputGroupAddon align="inline-end">
          <Phone />
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
});

PhoneNumberInput.displayName = "PhoneNumberInput";

export default PhoneNumberInput;
