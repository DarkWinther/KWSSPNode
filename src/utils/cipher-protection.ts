import { createCipheriv, createDecipheriv, randomFill, scrypt } from 'crypto';
import fs from 'fs';

const algorithm = 'aes-192-cbc';
const secret = JSON.parse(
  fs
    .readFileSync(
      __dirname + '\\..\\secrets\\b2ae5d99-9bef-47db-bd60-fbf66e99c50c.json'
    )
    .toString()
);

export const protect = (text: string) => {
  return new Promise<string>((resolve, reject) => {
    scrypt(secret.dataKey, 'salt', 24, (error, key) => {
      if (error) reject(error);
      randomFill(new Uint8Array(16), (err, iv) => {
        if (err) reject(err);
        const cipher = createCipheriv(algorithm, key, iv);
        let encrypted = cipher.update(text, 'utf8', 'hex');
        encrypted += cipher.final().toString('hex');
        resolve(`${Buffer.from(iv).toString('hex')}:${encrypted}`);
      });
    });
  });
};

export const unProtect = (ctext: string) => {
  return new Promise<string>((resolve, reject) => {
    scrypt(secret.dataKey, 'salt', 24, (error, key) => {
      if (error) reject(error);
      const [ivHex, encrypted] = ctext.split(':');
      const ivArr = ivHex.match(/.{2}/g);
      if (ivArr?.length) {
        const iv = new Uint8Array(ivArr.map(m => parseInt(m, 16)));
        const decipher = createDecipheriv(algorithm, key, iv);
        let decrypted = decipher.update(encrypted, 'hex', 'utf8');
        decrypted += decipher.final().toString('utf8');
        resolve(decrypted);
      } else {
        reject('Invalid IV');
      }
    });
  });
};
