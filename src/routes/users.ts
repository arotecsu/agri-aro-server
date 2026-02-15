import { getTokenHeader } from "../auth";
import {
  createUser,
  hasUser,
  loginUser,
  hasUserById,
  getDevicesOfUser,
  getUserData,
  verifyDevice,
  getFieldsOfUser,
  generateCustomTokenUser,
  verifyPassword,
  updatePassword,
} from "../firebase";
import { generateToken, verifyToken } from "../jwt";

import { Request, Response } from "express";
//Create
async function CreateUserRoute(req: Request, res: Response) {
  var { email, telefone, nome, password } = req.body;

  if (!email || !telefone || !nome || !password) {
    res.send({
      status: "failed",
      message: "Invalid request",
    });
    return;
  }
  if (!telefone.startsWith("+")) {
    telefone = "+244" + telefone;
  }
  var uid = "";
  try {
    if (await hasUser(email)) {
      res.send({
        status: "failed",
        message: "User exists",
      });
      return;
    }

    uid = await createUser(email, nome, telefone, password);
  } catch (err) {
    console.log(err.message);
    res.send({
      status: "failed",
      message: "Invalid request",
    });
    return;
  }

  const token = generateToken({
    uid: uid,
  });

  res.send({
    token,
    user_id: uid,
    status: "success",
  });
}

//Login
async function LoginUserRoute(req: Request, res: Response) {
  const { token_id } = req.body;

  if (!token_id) {
    res.send({
      status: "failed",
      message: "Invalid request",
    });
    return;
  }

  const uid = await loginUser(token_id);

  if (uid == "") {
    res.send({
      status: "failed",
      message: "Incorrect Token ID",
    });
    return;
  }

  const token = generateToken({
    uid: uid,
  });

  res.send({
    token,
    status: "success",
  });
}

// Verificar o login
async function VerifyUserRoute(req: Request, res: Response) {
  const token = getTokenHeader(req);

  const data = verifyToken(token);

  const { uid } = data;

  if (hasUserById(uid)) {
    res.send({
      status: "success",
      message: "Valid token",
    });
  } else {
    res.send({
      status: "failed",
      message: "Invalid token",
    });
  }
}

// Pegar dados do usuario logado

async function UserDataRoute(req: Request, res: Response) {
  const token = getTokenHeader(req);

  const data = verifyToken(token);
  const { uid } = data;

  const user_data = await getUserData(uid);
  const fields = await getFieldsOfUser(uid, user_data.email);

  res.send({
    status: "success",
    user_data: {
      ...user_data,
    },
    fields: fields,
  });
}

// Gera um token personalizado

async function CustomTokenUserRoute(req: Request, res: Response) {
  const token = getTokenHeader(req);

  const data = verifyToken(token);
  const { uid } = data;

  const customToken = await generateCustomTokenUser(uid);
  res.send({
    status: "success",
    customToken,
  });
}

async function UpdatePasswordRoute(req: Request, res: Response) {
  const { token_id, new_password } = req.body;

  const token = getTokenHeader(req);

  if (!token || !token_id || !new_password) {
    res.send({
      status: "failed",
      message: "Invalid request",
    });
    return;
  }

  const response = await updatePassword(token_id, new_password);

  if (response) {
    res.send({
      status: "success",
      message: "Password updated",
    });
    return;
  } else {
    res.send({
      status: "failed",
      message: "Invalid token",
    });
    return;
  }
}

module.exports = {
  CreateUserRoute,
  LoginUserRoute,
  VerifyUserRoute,
  UserDataRoute,
  CustomTokenUserRoute,
  UpdatePasswordRoute,
};
