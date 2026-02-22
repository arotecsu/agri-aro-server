import bcrypt from "bcrypt";

class PasswordService {
  compare(password: string, hash: string): boolean {
    return bcrypt.compareSync(password, hash);
  }

  hash(password: string): string {
    return bcrypt.hashSync(password, 10);
  }

  generateResetToken(): string {
    const token = Math.random().toString(36).substr(2);
    return token;
  }
}

export const passwordService = new PasswordService();
