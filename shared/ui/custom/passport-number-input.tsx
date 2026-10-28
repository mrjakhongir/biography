"use client";

import { IdCard } from "lucide-react";
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

const PassportNumberInput = forwardRef<HTMLInputElement, Properties>(
  ({ value, onChange, error, disabled }, reference) => {
    const id = useId();
    return (
      <div className="w-full">
        <InputGroup>
          <InputGroupInput
            id={id}
            type="text"
            placeholder="AD 1234567"
            value={value}
            onChange={(event) => onChange?.(event.target.value)}
            ref={(element) => {
              withMask("aa9999999", {
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
            <IdCard />
          </InputGroupAddon>
        </InputGroup>
      </div>
    );
  },
);

PassportNumberInput.displayName = "PassportNumberInput";

export default PassportNumberInput;
