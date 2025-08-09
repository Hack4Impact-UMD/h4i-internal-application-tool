const emailRegExp = new RegExp("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$");
const passwordRegExp = new RegExp(
  "^(?=.*[A-Z])(?=.*[a-z])(?=.*\\d)(?=.*[@$!%*?&#])[A-Za-z\\d@$!%*?&#]{8,}$",
);
const codeRegExp = new RegExp("^[A-Z0-9]{6}$");

export function validEmail(email: string): boolean {
  return (
    emailRegExp.test(email) &&
    (email.trim().endsWith("umd.edu") ||
      email.trim().endsWith("hack4impact.org"))
  );
}

export function validPassword(password: string): boolean {
  return passwordRegExp.test(password);
}

export function validCode(code: string): boolean {
  return codeRegExp.test(code);
}
