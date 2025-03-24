const emailRegExp = new RegExp("^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$")

export function validEmail(email: string): boolean {
  return emailRegExp.test(email)
}
