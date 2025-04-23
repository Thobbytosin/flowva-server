import jwt from "jsonwebtoken";
export const isPasswordStrong = (password: string) => {
  const passwordLength = password.trim().length;

  //   console.log("LENGTH:", password.trim().length);
  // check password strength
  const hasUpperCase = () => !!password.match(/[a-z]/);
  const hasLowerCase = () => !!password.match(/[A-Z]/);
  const hasNumber = () => !!password.match(/[0-9]/);
  const hasSpecialChar = () => !!password.match(/[!@#$%^&*(),.?":{}|<>]/);

  // Password Test
  const passwordIsArbitrarilyStrongEnough =
    hasUpperCase() &&
    hasLowerCase() &&
    hasNumber() &&
    hasSpecialChar() &&
    passwordLength >= 8;

  return passwordIsArbitrarilyStrongEnough;
};

// check email format
export const isEmailValid: RegExp =
  /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

export const createVerificationToken = (user: any) => {
  const verificationCode = Math.floor(
    100000 + Math.random() * 900000
  ).toString(); // generates random 6 digit code

  const verificationToken = jwt.sign(
    { user, verificationCode },
    process.env.JWT_VERIFICATION_SECRET_KEY as string,
    { expiresIn: "5m" }
  );

  return { verificationCode, verificationToken };
};

export const createResetPasswordToken = (user: any) => {
  const resetCode = Math.floor(100000 + Math.random() * 900000).toString();

  const resetToken = jwt.sign(
    { user, resetCode },
    process.env.JWT_RESET_SECRET_KEY as string,
    { expiresIn: "5m" }
  );

  return { resetCode, resetToken };
};
