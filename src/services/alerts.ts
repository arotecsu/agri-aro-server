import { Timestamp } from "firebase-admin/firestore";
import { culturasParams } from "../data/fieldsParams";
import { verifyField, getUserData } from "../firebase";
import { generateAlertEmail } from "../templates/emails";
import { inInterval } from "../utils";
import { sendMail } from "./emails";

async function verifySensParms(field_id, data) {
  const field = await verifyField(field_id);

  if (field) {
    const currentSensParams = culturasParams.find((c) => {
      if (c.title == field.tipo_cultura) {
        return true;
      }
      return false;
    });

    if (currentSensParams) {
      const user = await getUserData(field.user_id);

      if (user) {
        var alertas = [
          !inInterval(data.temperatura, currentSensParams.temperatura)
            ? {
                title: "Temperatura",
                value: data.temperatura,
                interval: currentSensParams.temperatura,
                unit: "° C",
              }
            : null,

          !inInterval(
            data.umidade_ambiental,
            currentSensParams.umidade_ambiental,
          )
            ? {
                title: "Umidade Ambiental",
                value: data.umidade_ambiental,
                interval: currentSensParams.umidade_ambiental,
                unit: "%",
              }
            : null,

          !inInterval(data.umidade_solo, currentSensParams.umidade_solo)
            ? {
                title: "Umidade do Solo",
                value: data.umidade_solo,
                interval: currentSensParams.umidade_solo,
                unit: "%",
              }
            : null,

          !inInterval(data.ph, currentSensParams.ph)
            ? {
                title: "pH",
                value: data.ph,
                interval: currentSensParams.ph,
                unit: "",
              }
            : null,

          !inInterval(data.nitrogenio, currentSensParams.nitrogenio)
            ? {
                title: "Nitrogênio",
                value: data.nitrogenio,
                interval: currentSensParams.nitrogenio,
                unit: "mg/kg",
              }
            : null,

          !inInterval(data.fosforo, currentSensParams.fosforo)
            ? {
                title: "Fósforo",
                value: data.fosforo,
                interval: currentSensParams.fosforo,
                unit: "mg/kg",
              }
            : null,

          !inInterval(data.potassio, currentSensParams.potassio)
            ? {
                title: "Potássio",
                value: data.potassio,
                interval: currentSensParams.potassio,
                unit: "mg/kg",
              }
            : null,
        ];

        alertas = alertas.filter((_al) => {
          if (_al) {
            return true;
          }
          return false;
        });

        if (alertas.length > 0) {
          const emailContent = generateAlertEmail(
            user.nome,
            data.moment.toDate(),
            alertas,
          );
          await sendMail(user.email, "Alerta de Níveis Críticos", emailContent);
        }
        return true;
      }
    }
  }

  return false;
}

export { verifySensParms };
