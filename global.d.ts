export {};

declare global {
  interface Window {
    __refreshUser__?: () => void;
  }
}
