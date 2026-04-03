import React, { useState } from 'react';

import './switch.css';

type Option = {
  label: string;
  value: string;
};

interface SwitchProps {
  options: Option[];
  value?: string;
  defaultValue?: string;
  onChange?: (value: string) => void;
  className?: string;
}

const Switch = React.forwardRef<HTMLDivElement, SwitchProps>(function Switch(props, ref) {
  const { options, value, defaultValue, onChange, className, ...rest } = props;

  const [internalValue, setInternalValue] = useState(defaultValue);

  const selectedValue = value ?? internalValue;

  const handleClick = (val: string) => {
    if (!value) {
      setInternalValue(val);
    }
    onChange?.(val);
  };

  return (
    <div
      ref={ref}
      className={['core-switch', className].filter(Boolean).join(' ')}
      {...rest}
    >
      {options.map(opt => {
        const isActive = opt.value === selectedValue;

        return (
          <div
            key={opt.value}
            className={`switch__button ${isActive ? 'active' : ''}`}
            onClick={() => handleClick(opt.value)}
          >
            {opt.label}
          </div>
        );
      })}
    </div>
  );
});

export default Switch;
