export function setCookie(cName: string, cValue: string, expHours: number, cDomain?: string): void {
  const date = new Date();
  date.setTime(date.getTime() + (expHours * 60 * 60 * 1000));

  const expires = `expires=${date.toUTCString()}`;
  const domain = cDomain ? `Domain=${cDomain}` : "";
  document.cookie = `${cName}=${cValue}; ${expires}; ${domain};`;
}
