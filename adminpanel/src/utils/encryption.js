import AES from "crypto-js/aes";
import Utf8 from "crypto-js/enc-utf8";

export function encryptMessage(message, key) {
  return AES.encrypt(message, key).toString();
}

export function decryptMessage(ciphertext, key) {
  const bytes = AES.decrypt(ciphertext, key);
  return bytes.toString(Utf8);
}
