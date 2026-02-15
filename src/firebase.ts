import admin from "firebase-admin";

import serviceAccount from "../agri-aro-key-firebase.json";
import { Timestamp } from "firebase-admin/firestore";

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

async function getDevicesOfUser(user_id) {
  const _query = await admin
    .firestore()
    .collection("devices")
    .where("user_id", "==", user_id)
    .get();

  if (_query.size == 0) {
    return [];
  }
  return _query.docs.map((doc) => {
    return doc.data();
  });
}

async function getFieldsOfUser(user_id, email) {
  const _query1 = await admin
    .firestore()
    .collection("fields")
    .where("user_id", "==", user_id)
    .get();
  const _query2 = await admin
    .firestore()
    .collection("fields")
    .where("associates", "array-contains", email)
    .get();

  if (_query1.size == 0 && _query2.size == 0) {
    return [];
  }

  return await Promise.all(
    [..._query1.docs, ..._query2.docs].map(async (doc) => {
      const doc_data = doc.data();

      return {
        ...doc_data,
        id: doc.id,
      };
    }),
  );
}

async function saveDataOfDevice(device_id, data) {
  await admin
    .firestore()
    .collection(`dados_${device_id}`)
    .doc()
    .create({
      ...data,
    });
}

async function getUserData(uid) {
  const user = await admin.auth().getUser(uid);
  return {
    ...(await admin.firestore().collection("users").doc(uid).get()).data(),
    emailVerified: user.emailVerified,
    disabled: user.disabled,
  };
}

//verify device

async function verifyDevice(device_id) {
  const _query = await admin
    .firestore()
    .collection("devices")
    .where("device_id", "==", device_id)
    .get();

  if (_query.size == 0) {
    return null;
  }
  return _query.docs[0].data();
}

async function hasUserById(id) {
  try {
    const user = await admin.auth().getUser(id);
    if (user.uid) {
      return true;
    }
    return false;
  } catch (err) {
    console.log(err.message);

    return false;
  }
}
async function hasUser(email) {
  try {
    const user = await admin.auth().getUserByEmail(email);
    if (user.uid) {
      return true;
    }
    return false;
  } catch (err) {
    console.log(err.message);

    return false;
  }
}

async function createUser(email, nome, telefone, password) {
  const user = await admin.auth().createUser({
    emailVerified: false,
    email: email,
    displayName: nome,
    password: password,
    disabled: false,
  });

  await admin.firestore().collection("users").doc(user.uid).create({
    id: user.uid,
    nome: nome,
    email: email,
    telefone: telefone,
    dataCadastro: Timestamp.now(),
  });

  return user.uid;
}

async function loginUser(token_id) {
  try {
    const decodedToken = await admin.auth().verifyIdToken(token_id);

    return decodedToken.uid;
  } catch (err) {
    console.log(err.message);

    return "";
  }
}

async function getFields() {
  const query = await admin.firestore().collection("fields").get();
  if (query.size == 0) {
    return [];
  }

  const docs = query.docs.map((doc) => {
    return {
      id: doc.id,
      ...doc.data(),
    };
  });

  return docs;
}

async function addField(device_id, uid, data) {
  const { position, field_size, field_name, tipo_solo, tipo_cultura, address } =
    data;
  const _field = await admin.firestore().collection("fields").add({
    dataCriacao: Timestamp.now(),
    field_name,
    field_size,
    user_id: uid,
    device_id: device_id,
    address,
    position,
    tipo_solo,
    tipo_cultura,
    associates: [],
  });

  await admin.firestore().collection("devices").doc(device_id).update({
    field_id: _field.id,
    user_id: uid,
  });
}

async function updateField(field_id, updates, user_id) {
  if ("device_id" in updates) {
    await admin
      .firestore()
      .collection("devices")
      .doc(updates.device_id_last)
      .update({
        field_id: admin.firestore.FieldValue.delete(),
        user_id: admin.firestore.FieldValue.delete(),
      });

    await admin
      .firestore()
      .collection("devices")
      .doc(updates.device_id)
      .update({
        field_id: field_id,
        user_id: user_id,
      });

    delete updates.device_id_last;
  }
  await admin.firestore().collection("fields").doc(field_id).update(updates);
}

async function deleteField(field_id, device_id) {
  await admin.firestore().collection("devices").doc(device_id).update({
    field_id: admin.firestore.FieldValue.delete(),
    user_id: admin.firestore.FieldValue.delete(),
  });
  await admin.firestore().collection("fields").doc(field_id).delete();
}

async function updateAssociatesField(field_id, associates) {
  await admin.firestore().collection("fields").doc(field_id).update({
    associates,
  });
}

async function getSensData(device_id, min, max) {
  const _query = await admin
    .firestore()
    .collection(`dados_${device_id}`)
    .where("moment", ">", Timestamp.fromDate(new Date(min)))
    .where("moment", "<", Timestamp.fromDate(new Date(max)))
    .get();

  return _query.docs.map((doc) => {
    return doc.data();
  });
}

async function generateCustomTokenUser(uid) {
  return await admin.auth().createCustomToken(uid);
}

async function updatePassword(token_id, new_password) {
  try {
    const decodedToken = await admin.auth().verifyIdToken(token_id);

    const uid = decodedToken.uid;
    await admin.auth().updateUser(uid, {
      password: new_password,
    });
    return true;
  } catch (err) {
    console.log(err.message);

    return false;
  }
}

async function verifyField(field_id) {
  const doc = await admin.firestore().collection("fields").doc(field_id).get();

  if (!doc.exists) {
    return null;
  }
  return {
    ...doc.data(),
    id: field_id,
  };
}

async function associateUser(field_id, email) {
  try {
    const doc = admin.firestore().collection("fields").doc(field_id);
    const doc_data = (await doc.get()).data();

    const associates = doc_data.associates ?? [];

    await doc.update({
      associates: [...associates, email],
    });
    return true;
  } catch (ex) {
    console.log(ex.message);
    return null;
  }
}

export {
  createUser,
  hasUser,
  loginUser,
  verifyDevice,
  verifyField,
  saveDataOfDevice,
  hasUserById,
  getUserData,
  getDevicesOfUser,
  getFieldsOfUser,
  addField,
  updateField,
  deleteField,
  updateAssociatesField,
  getSensData,
  generateCustomTokenUser,
  updatePassword,
  associateUser,
  getFields,
};
