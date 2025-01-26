const validateName = (fullName: string): string | null => {
  if (!fullName) {
    return "Name cannot be Blank.";
  }
  return null;
};

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

const validatePassword = (
  password: string,
  password2: string
): string | null => {
  if (!password) {
    return "Password is required.";
  } else if (password.length < 6) {
    return "Password must be at least 6 characters long.";
  } else if (password !== password2) {
    return "Passwords do not match.";
  }

  return null;
};

const validateRegister = (
  fullName: string,
  email: string,
  password: string,
  password2: string
): {
  isValid: boolean;
  errors: {
    fullName?: string;
    email?: string;
    password?: string;
    password2?: string;
  };
} => {
  const nameError = validateName(fullName);
  const emailError = validateEmail(email);
  const passwordError = validatePassword(password, password2);

  return {
    isValid: !nameError && !emailError && !passwordError,
    errors: {
      ...(nameError && { fullName: nameError }),
      ...(emailError && { email: emailError }),
      ...(passwordError && {
        password: passwordError,
        password2: passwordError || "",
      }),
    },
  };
};

export default validateRegister;
