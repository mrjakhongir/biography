"use client";

import { Calendar } from "lucide-react";
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

const DateInput = forwardRef<HTMLInputElement, Properties>(({ value, onChange, error, disabled }, reference) => {
  const id = useId();
  return (
    <div className="w-full">
      <InputGroup>
        <InputGroupInput
          id={id}
          type="text"
          placeholder="08.05.2004"
          value={value}
          onChange={(event) => onChange?.(event.target.value)}
          ref={(element) => {
            withMask("99.99.9999", {
              placeholder: "•",
              showMaskOnHover: false,
            })(element);

            if (typeof reference === "function") reference(element);
            else if (reference) reference.current = element;
          }}
          autoComplete="off"
          aria-invalid={!!error}
          readOnly={disabled}
          className={error ? "border-destructive focus-visible:ring-destructive" : ""}
        />

        <InputGroupAddon align="inline-end">
          <Calendar />
        </InputGroupAddon>
      </InputGroup>
    </div>
  );
});

DateInput.displayName = "DateInput";

export default DateInput;
