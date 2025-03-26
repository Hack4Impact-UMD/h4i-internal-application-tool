const emailRegExp = new RegExp("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$")
const passwordRegExp = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&#])[A-Za-z\d@$!%*?&#]{8,}$/
// why doesnt this work in RegExp()? ^
const codeRegExp = new RegExp("^[A-Z0-9]{6}$")

export function validEmail(email: string): boolean {
  return emailRegExp.test(email)
}

export function validPassword(password: string): boolean {
  return passwordRegExp.test(password)
}

export function validCode(code: string): boolean {
  return codeRegExp.test(code)
}