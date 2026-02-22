import type { Request, Response } from "express";
import { User } from "../database/models/user";
import { passwordService } from "../auth/password";
import { jwtService } from "../auth/jwt";

export class AuthController {
  async register(req: Request, res: Response) {
    const { name, email, phone, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) return res.sendStatus(409);

    const user = new User({
      name,
      password: passwordService.hash(password),
      email,
      phone,
    });

    const userCreated = await user.save();

    res.json({
      accessToken: jwtService.generateToken({ id: userCreated._id.toString() }),
      user: userCreated,
    });
  }

  async login(req: Request, res: Response) {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.sendStatus(404);
    if (!passwordService.compare(password, user.password))
      return res.sendStatus(401);

    res.json({
      accessToken: jwtService.generateToken({ id: user._id.toString() }),
      user,
    });
  }

  async forgotPassword(req: Request, res: Response) {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.sendStatus(404);

    const resetToken = passwordService.generateResetToken();
    const resetPasswordExpires = new Date();
    resetPasswordExpires.setHours(resetPasswordExpires.getHours() + 1);

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetPasswordExpires;

    await user.save();
    res.sendStatus(200);
  }

  async verifyResetToken(req: Request, res: Response) {
    const { token } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) return res.sendStatus(404);
    res.sendStatus(200);
  }

  async resetPassword(req: Request, res: Response) {
    const { token, newPassword } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) return res.sendStatus(404);

    user.password = passwordService.hash(newPassword);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();
    res.sendStatus(200);
  }
}

export const authController = new AuthController();
