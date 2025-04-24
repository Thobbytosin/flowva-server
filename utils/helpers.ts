import jwt from "jsonwebtoken";

export const isPasswordStrong = (password: string) => {
  const passwordLength = password.trim().length;

  const hasAlphabet = () => !!password.match(/[a-zA-Z]/);
  const hasNumber = () => !!password.match(/[0-9]/);
  const hasSpecialChar = () => !!password.match(/[!@#$%^&*(),.?":{}|<>]/);

  // Password Test
  const passwordIsArbitrarilyStrongEnough =
    hasAlphabet() && hasNumber() && hasSpecialChar() && passwordLength >= 8;

  return passwordIsArbitrarilyStrongEnough;
};

// check email format
export const isEmailValid: RegExp =
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
