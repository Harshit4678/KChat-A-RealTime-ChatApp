import CryptoJS from "crypto-js";

export function encryptMessage(message, key) {
  return CryptoJS.AES.encrypt(message, key).toString();
}

export function decryptMessage(ciphertext, key) {
  const bytes = CryptoJS.AES.decrypt(ciphertext, key);
  return bytes.toString(CryptoJS.enc.Utf8);
}
