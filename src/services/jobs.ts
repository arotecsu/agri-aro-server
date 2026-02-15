import cron from "node-cron";
import { getFields, getUserData } from "../firebase";
import { sendMail } from "./emails";
import { generateReportEmail } from "../templates/emails";

function initJob() {
  cron.schedule("0 9 * * *", async () => {
    const date = new Date(new Date().getTime() - 1000 * 60 * 60 * 24);
    const fields = await getFields();

    for (const field of fields) {
      const user = await getUserData(field.user_id);
      const emailContent = generateReportEmail(
        user.nome,
        field.field_name,
        date,
      );
      await sendMail(user.email, "Relatório Diário AGRI-ARO", emailContent);
    }
  });
}

export { initJob };
