declare module 'qrcode-terminal' {
  interface Options {
    small?: boolean;
  }
  export function generate(input: string, options?: Options, callback?: (qrcode: string) => void): void;
  export function setErrorLevel(errorLevel: string): void;
}
