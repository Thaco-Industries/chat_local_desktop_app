import React, { forwardRef, useEffect, useState } from 'react';

const CustomField = forwardRef<
  HTMLInputElement,
  React.InputHTMLAttributes<HTMLInputElement>
>(({ value, placeholder = '', style, ...props }, ref) => {
  const [inputWidth, setInputWidth] = useState('auto');

  // useEffect(() => {
  //   if (typeof value === 'string') {
  //     // Đặt chiều rộng tối thiểu là 4ch (hoặc giá trị bạn muốn)
  //     const calculatedWidth = `${Math.max(value.length + 5, 10)}ch`; // Đảm bảo chiều rộng tối thiểu
  //     setInputWidth(calculatedWidth);
  //   }
  // }, [value]);

  return (
    <div className="relative inline-block">
      <input
        {...props}
        ref={ref}
        value={value}
        placeholder={placeholder}
        style={{
          ...style,
        }}
        className={`text-title max-w-[200px] sm:max-w-[300px] tablet:max-w-[280px] lg:max-w-[420px] h-[24px] rounded-sm border-none outline-none bg-transparent p-2 ${props.className}`}
      />
    </div>
  );
});

CustomField.displayName = 'CustomField';

export default CustomField;
