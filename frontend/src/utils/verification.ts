const emailRegExp = new RegExp("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$");
// const passwordRegExp =
// /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/;
//TODO: this doesn't seem to be working!
// why doesnt this work in RegExp()? ^
const codeRegExp = new RegExp("^[A-Z0-9]{6}$");

export function validEmail(email: string): boolean {
  return emailRegExp.test(email) && email.trim().endsWith("umd.edu");
}

export function validPassword(password: string): boolean {
  // return passwordRegExp.test(password)
  return password.length >= 6;
}

export function validCode(code: string): boolean {
  return codeRegExp.test(code);
}
