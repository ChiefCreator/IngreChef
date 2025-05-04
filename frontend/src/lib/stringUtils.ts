export function getPluralForm(n: number, forms: [string, string, string]): string {
  const absN = Math.abs(n);
  const lastDigit = absN % 10;
  const lastTwoDigits = absN % 100;

  let form: string;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    form = forms[2];
  }
  else if (lastDigit === 1) {
    form = forms[0];
  }
  else if (lastDigit >= 2 && lastDigit <= 4) {
    form = forms[1];
  } else {
    form = forms[2];
  }

  return `${n} ${form}`;
}
