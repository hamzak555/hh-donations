import React from 'react';

// Container component
export const Container = ({ children, size = "lg", py = "2rem", ...props }) => {
  const sizeClasses = {
    sm: "max-w-2xl",
    md: "max-w-4xl", 
    lg: "max-w-6xl",
    xl: "max-w-7xl"
  };
  
  return (
    <div 
      className={`container mx-auto px-4 ${sizeClasses[size]}`}
      style={{ paddingTop: py, paddingBottom: py }}
      {...props}
    >
      {children}
    </div>
  );
};

// Stack component
export const Stack = ({ children, spacing = "1rem", ...props }) => (
  <div className="flex flex-col" style={{ gap: spacing }} {...props}>
    {children}
  </div>
);

// Group component
export const Group = ({ children, spacing = "1rem", position = "left", grow = false, mb, ...props }) => {
  const positionClasses = {
    left: "justify-start",
    center: "justify-center", 
    right: "justify-end",
    apart: "justify-between"
  };
  
  return (
    <div 
      className={`flex items-center ${positionClasses[position]} ${grow ? 'flex-grow' : ''}`}
      style={{ gap: spacing, marginBottom: mb }}
      {...props}
    >
      {children}
    </div>
  );
};

// Card component
export const Card = ({ children, shadow = "sm", padding = "1rem", radius = "8px", ...props }) => (
  <div 
    className="bg-white border border-gray-200 rounded-lg shadow-sm"
    style={{ padding, borderRadius: radius }}
    {...props}
  >
    {children}
  </div>
);

// Title component
export const Title = ({ children, order = 1, ...props }) => {
  const Tag = `h${order}`;
  const sizeClasses = {
    1: "text-3xl font-bold",
    2: "text-2xl font-semibold", 
    3: "text-xl font-semibold",
    4: "text-lg font-medium"
  };
  
  return (
    <Tag className={sizeClasses[order]} {...props}>
      {children}
    </Tag>
  );
};

// Text component
export const Text = ({ children, size = "sm", weight, color, ...props }) => {
  const sizeClasses = {
    xs: "text-xs",
    sm: "text-sm",
    md: "text-base", 
    lg: "text-lg"
  };
  
  const weightClasses = {
    300: "font-light",
    400: "font-normal",
    500: "font-medium", 
    600: "font-semibold",
    700: "font-bold"
  };
  
  const colorClasses = {
    dimmed: "text-gray-500"
  };
  
  return (
    <p 
      className={`${sizeClasses[size]} ${weight ? weightClasses[weight] : ''} ${color ? colorClasses[color] : ''}`}
      {...props}
    >
      {children}
    </p>
  );
};

// Button component
export const Button = ({ 
  children, 
  variant = "filled", 
  color = "blue",
  size = "md",
  leftIcon,
  rightIcon,
  loading = false,
  disabled = false,
  fullWidth = false,
  radius = "6px",
  ...props 
}) => {
  const baseClasses = "inline-flex items-center justify-center font-medium transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const sizeClasses = {
    xs: "px-2 py-1 text-xs",
    sm: "px-3 py-1.5 text-sm", 
    md: "px-4 py-2 text-sm",
    lg: "px-6 py-3 text-base"
  };
  
  const variantClasses = {
    filled: `bg-blue-600 text-white hover:bg-blue-700`,
    outline: `border border-gray-300 bg-white text-gray-700 hover:bg-gray-50`,
    subtle: `bg-gray-100 text-gray-700 hover:bg-gray-200`
  };
  
  return (
    <button
      className={`${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${fullWidth ? 'w-full' : ''}`}
      style={{ borderRadius: radius }}
      disabled={disabled || loading}
      {...props}
    >
      {loading && <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"></div>}
      {leftIcon && <span className="mr-2">{leftIcon}</span>}
      {children}
      {rightIcon && <span className="ml-2">{rightIcon}</span>}
    </button>
  );
};

// TextInput component
export const TextInput = ({ 
  label, 
  placeholder, 
  value, 
  onChange, 
  type = "text",
  required = false,
  icon,
  rightSection,
  size = "md",
  radius = "6px",
  ...props 
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <div className="relative">
        {icon && (
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            {icon}
          </div>
        )}
        <input
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          required={required}
          className={`w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 ${icon ? 'pl-10' : ''}`}
          style={{ borderRadius: radius }}
          {...props}
        />
        {rightSection && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {rightSection}
          </div>
        )}
      </div>
    </div>
  );
};

// Select component
export const Select = ({ 
  label, 
  placeholder, 
  value, 
  onChange, 
  data = [],
  required = false,
  ...props 
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        required={required}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        {...props}
      >
        {placeholder && <option value="">{placeholder}</option>}
        {data.map((item, index) => (
          <option key={index} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    </div>
  );
};

// Textarea component
export const Textarea = ({ 
  label, 
  placeholder, 
  value, 
  onChange, 
  required = false,
  minRows = 3,
  ...props 
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        rows={minRows}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        {...props}
      />
    </div>
  );
};

// Badge component
export const Badge = ({ children, color = "blue", variant = "light", size = "sm", ...props }) => {
  const baseClasses = "inline-flex items-center font-medium rounded-full";
  
  const sizeClasses = {
    xs: "px-2 py-0.5 text-xs",
    sm: "px-2.5 py-0.5 text-xs", 
    md: "px-3 py-1 text-sm"
  };
  
  const colorClasses = {
    blue: variant === "light" ? "bg-blue-100 text-blue-800" : "bg-blue-600 text-white",
    green: variant === "light" ? "bg-green-100 text-green-800" : "bg-green-600 text-white",
    red: variant === "light" ? "bg-red-100 text-red-800" : "bg-red-600 text-white",
    yellow: variant === "light" ? "bg-yellow-100 text-yellow-800" : "bg-yellow-600 text-white",
    gray: variant === "light" ? "bg-gray-100 text-gray-800" : "bg-gray-600 text-white"
  };
  
  return (
    <span 
      className={`${baseClasses} ${sizeClasses[size]} ${colorClasses[color]}`}
      {...props}
    >
      {children}
    </span>
  );
};

// Alert component
export const Alert = ({ children, icon, color = "blue", ...props }) => {
  const colorClasses = {
    blue: "bg-blue-50 border-blue-200 text-blue-800",
    green: "bg-green-50 border-green-200 text-green-800", 
    red: "bg-red-50 border-red-200 text-red-800",
    yellow: "bg-yellow-50 border-yellow-200 text-yellow-800"
  };
  
  return (
    <div className={`p-4 border rounded-lg ${colorClasses[color]}`} {...props}>
      <div className="flex items-start">
        {icon && <div className="mr-3 mt-0.5">{icon}</div>}
        <div>{children}</div>
      </div>
    </div>
  );
};

// ActionIcon component
export const ActionIcon = ({ children, color = "blue", variant = "light", size = "md", ...props }) => {
  const sizeClasses = {
    xs: "w-6 h-6",
    sm: "w-8 h-8",
    md: "w-10 h-10", 
    lg: "w-12 h-12"
  };
  
  const colorClasses = {
    blue: variant === "light" ? "text-blue-600 hover:bg-blue-50" : "bg-blue-600 text-white hover:bg-blue-700",
    red: variant === "light" ? "text-red-600 hover:bg-red-50" : "bg-red-600 text-white hover:bg-red-700",
    green: variant === "light" ? "text-green-600 hover:bg-green-50" : "bg-green-600 text-white hover:bg-green-700"
  };
  
  return (
    <button
      className={`inline-flex items-center justify-center rounded-md transition-colors ${sizeClasses[size]} ${colorClasses[color]}`}
      {...props}
    >
      {children}
    </button>
  );
};

// Center component
export const Center = ({ children, mt, ...props }) => (
  <div className="flex justify-center" style={{ marginTop: mt }} {...props}>
    {children}
  </div>
);

// Loader component
export const Loader = ({ size = "md" }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-8 h-8",
    lg: "w-12 h-12"
  };
  
  return (
    <div className={`animate-spin border-2 border-blue-600 border-t-transparent rounded-full ${sizeClasses[size]}`}></div>
  );
};

// Switch component
export const Switch = ({ label, checked, onChange, ...props }) => (
  <div className="flex items-center">
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="sr-only peer"
        {...props}
      />
      <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
      {label && <span className="ml-3 text-sm text-gray-700">{label}</span>}
    </label>
  </div>
);

// NumberInput component  
export const NumberInput = ({ 
  label, 
  placeholder, 
  value, 
  onChange, 
  min,
  precision = 0,
  required = false,
  ...props 
}) => {
  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type="number"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(precision > 0 ? parseFloat(e.target.value) : parseInt(e.target.value))}
        min={min}
        step={precision > 0 ? `0.${'0'.repeat(precision - 1)}1` : 1}
        required={required}
        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        {...props}
      />
    </div>
  );
};

// Modal component
export const Modal = ({ 
  opened, 
  onClose, 
  title, 
  children, 
  size = "md",
  ...props 
}) => {
  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg", 
    lg: "max-w-2xl",
    xl: "max-w-4xl"
  };
  
  if (!opened) return null;
  
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div className="fixed inset-0 transition-opacity" onClick={onClose}>
          <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
        </div>
        
        <div className={`inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle w-full ${sizeClasses[size]}`}>
          <div className="bg-white px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            {title && (
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-medium text-gray-900">{title}</h3>
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-gray-600"
                >
                  ✕
                </button>
              </div>
            )}
            {children}
          </div>
        </div>
      </div>
    </div>
  );
};

// Pagination component
export const Pagination = ({ 
  page, 
  onChange, 
  total, 
  size = "md",
  withEdges = false,
  ...props 
}) => {
  const pages = Array.from({ length: total }, (_, i) => i + 1);
  
  return (
    <div className="flex items-center space-x-2">
      {withEdges && (
        <button
          onClick={() => onChange(1)}
          disabled={page === 1}
          className="px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          First
        </button>
      )}
      
      <button
        onClick={() => onChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
      >
        Previous
      </button>
      
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onChange(p)}
          className={`px-3 py-1 text-sm border rounded ${
            p === page
              ? 'bg-blue-600 text-white border-blue-600'
              : 'hover:bg-gray-50'
          }`}
        >
          {p}
        </button>
      ))}
      
      <button
        onClick={() => onChange(Math.min(total, page + 1))}
        disabled={page === total}
        className="px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
      >
        Next
      </button>
      
      {withEdges && (
        <button
          onClick={() => onChange(total)}
          disabled={page === total}
          className="px-3 py-1 text-sm border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
        >
          Last
        </button>
      )}
    </div>
  );
};

// Menu component
export const Menu = ({ children, ...props }) => (
  <div className="relative inline-block text-left" {...props}>
    {children}
  </div>
);