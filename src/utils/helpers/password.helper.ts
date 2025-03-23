import * as bcrypt from 'bcrypt';

export class PasswordHelper {
  static async hash(
    password: string | undefined,
    saltRounds = 10,
  ): Promise<string> {
    if (!password) {
      throw new Error('Password is required for hashing');
    }
    return bcrypt.hash(password, saltRounds);
  }

  static async compare(
    password: string | undefined,
    hashedPassword: string,
  ): Promise<boolean> {
    if (!password) {
      return false;
    }
    return bcrypt.compare(password, hashedPassword);
  }
}
