const validateEmail = (email: string): string | null => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email) {
    return "Email is required.";
  }
  if (!emailRegex.test(email)) {
    return "Invalid email format.";
  }
  return null;
};

const validatePassword = (password: string): string | null => {
  if (!password) {
    return "Password is required.";
  }
  return null;
};

const validateLogin = (
  email: string,
  password: string
): { isValid: boolean; errors: { email?: string; password?: string } } => {
  const emailError = validateEmail(email);
  const passwordError = validatePassword(password);

  return {
    isValid: !emailError && !passwordError,
    errors: {
      ...(emailError && { email: emailError }),
      ...(passwordError && { password: passwordError }),
    },
  };
};

export default validateLogin;
