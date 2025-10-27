export const requiredValidator = (
  value: string | number | null | undefined,
  label?: string
): string | boolean => {
  if (value === undefined || value === null) {
    return `*${label ?? "Field"} is required`;
  }

  if (typeof value === "string" && value.trim() === "") {
    return `*${label ?? "Field"} is required`;
  }

  return false;
};
export const updateFormDataWithHelperText = (
  fieldName: string,
  helperText: string | boolean,
  setFormError: any
) => {
  setFormError((prevFormError: any) => ({
    ...prevFormError,
    [fieldName]: helperText,
  }));
};
export const mobileNumberValidator = (
  value: any,
  key: string
): string | boolean => {
  const requiredError = requiredValidator(value, key);

  // if (requiredError) {
  //   return requiredError;
  // }

  const mobileNumberRegex = /^[1-9]\d{9}$/;

  // Check if value contains only numbers
  if (value && !/^[0-9]*$/i.test(value)) {
    return "*Only numbers are allowed";
  }

  // Check if value matches the 10-digit pattern
  if (value && !mobileNumberRegex.test(value)) {
    return "*Invalid mobile number";
  }
  return false; // No error, validation successful
};

export const emailValidator = (value: any, key: string): string | boolean => {
  const requiredError = requiredValidator(value, key);

  // if (requiredError) {
  //   return requiredError;
  // }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (value && !emailRegex.test(value)) {
    return "*Invalid email address";
  }

  return false; // No error, validation successful
};

export const aadhaarNumberValidator = (
  value: string,
  key: string
): string | boolean => {
  if (requiredValidator(value)) {
    return requiredValidator(value, key);
  }

  // const aadhaarNumberRegex = /^[0-9]{14}$/;
  if (value && !/^[0-9]*$/i.test(value)) {
    return "*Only numbers are allowed";
  }

  if (value && value.length !== 14) {
    return "*Aadhaar number must be in 14";
  }

  return false; // No error, validation successful
};
export const pinCodeValidator = (
  value: string,
  key: string
): string | boolean => {
  if (requiredValidator(value)) {
    return requiredValidator(value, key);
  }

  // const aadhaarNumberRegex = /^[0-9]{14}$/;
  if (value && !/^[0-9]*$/i.test(value)) {
    return "*Only numbers are allowed";
  }

  if (value && value.length !== 6) {
    return "Pincode must be in 6";
  }

  return false; // No error, validation successful
};
export const numberToWords = (number: any) => {
  const units = [
    "",
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
  ];
  const teens = [
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  const tens = [
    "",
    "",
    "Twenty",
    "Thirty",
    "Forty",
    "Fifty",
    "Sixty",
    "Seventy",
    "Eighty",
    "Ninety",
  ];

  if (number === 0) return "zero";

  let words = "";

  // Handle thousands
  if (Math.floor(number / 1000) > 0) {
    words += numberToWords(Math.floor(number / 1000)) + " thousand ";
    number %= 1000;
  }

  // Handle hundreds
  if (Math.floor(number / 100) > 0) {
    words += units[Math.floor(number / 100)] + " hundred ";
    number %= 100;
  }

  // Handle tens and units
  if (number > 0) {
    if (words !== "") words += " ";
    if (number < 10) {
      words += units[number];
    } else if (number < 20) {
      words += teens[number - 10];
    } else {
      words += tens[Math.floor(number / 10)];
      if (number % 10 !== 0) {
        words += "-" + units[number % 10];
      }
    }
  }

  return words.trim();
};
