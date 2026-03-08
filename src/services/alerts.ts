import { culturasParams } from "../data/params";
import { generateAlertEmail } from "../templates/emails";
import { inInterval } from "./date";
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
          !inInterval(data.temperature, currentSensParams.temperature)
            ? {
                title: "Temperatura",
                value: data.temperature,
                interval: currentSensParams.temperature,
                unit: "° C",
              }
            : null,

          !inInterval(data.ambientHumidity, currentSensParams.ambientHumidity)
            ? {
                title: "Umidade Ambiental",
                value: data.ambientHumidity,
                interval: currentSensParams.ambientHumidity,
                unit: "%",
              }
            : null,

          !inInterval(data.soilMoisture, currentSensParams.soilMoisture)
            ? {
                title: "Umidade do Solo",
                value: data.soilMoisture,
                interval: currentSensParams.soilMoisture,
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

          !inInterval(data.nitrogen, currentSensParams.nitrogen)
            ? {
                title: "Nitrogênio",
                value: data.nitrogen,
                interval: currentSensParams.nitrogen,
                unit: "mg/kg",
              }
            : null,

          !inInterval(data.phosphorus, currentSensParams.phosphorus)
            ? {
                title: "Fósforo",
                value: data.phosphorus,
                interval: currentSensParams.phosphorus,
                unit: "mg/kg",
              }
            : null,

          !inInterval(data.potassium, currentSensParams.potassium)
            ? {
                title: "Potássio",
                value: data.potassium,
                interval: currentSensParams.potassium,
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
