import type { Request, Response } from "express";
import { User } from "../database/models/user";
import { passwordService } from "../auth/password";
import { jwtService } from "../auth/jwt";
import { sendMail } from "../services/emails";
import { generatePasswordResetEmail } from "../templates/emails";

export class AuthController {
  register = async (req: Request, res: Response): Promise<void> => {
    const { name, email, phone, password } = req.body;

    const exists = await User.findOne({ email });
    if (exists) {
      res.sendStatus(409);
      return;
    }

    const user = new User({
      name,
      password: passwordService.hash(password),
      email,
      phone,
    });

    const userCreated = await user.save();

    res.json({
      accessToken: jwtService.generateToken({
        userId: userCreated._id.toString(),
      }),
      user: userCreated,
    });
  };

  login = async (req: Request, res: Response): Promise<void> => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.sendStatus(404);
      return;
    }
    if (!passwordService.compare(password, user.password)) {
      res.sendStatus(401);
      return;
    }

    res.json({
      accessToken: jwtService.generateToken({ userId: user._id.toString() }),
      user,
    });
  };

  forgotPassword = async (req: Request, res: Response): Promise<void> => {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.sendStatus(404);
      return;
    }

    const resetToken = passwordService.generateResetToken();
    const resetPasswordExpires = new Date();
    resetPasswordExpires.setHours(resetPasswordExpires.getHours() + 1);

    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetPasswordExpires;

    await user.save();
    await sendMail(
      user.email,
      "Recuperação de Senha - AGRI-ARO",
      generatePasswordResetEmail(user.name, resetToken),
    );
    res.sendStatus(200);
  };

  verifyResetToken = async (req: Request, res: Response): Promise<void> => {
    const { token } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      res.sendStatus(404);
      return;
    }
    res.sendStatus(200);
  };

  resetPassword = async (req: Request, res: Response): Promise<void> => {
    const { token, newPassword } = req.body;

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: new Date() },
    });

    if (!user) {
      res.sendStatus(404);
      return;
    }

    user.password = passwordService.hash(newPassword);
    user.resetPasswordToken = null;
    user.resetPasswordExpires = null;

    await user.save();
    res.sendStatus(200);
  };
}

export const authController = new AuthController();
