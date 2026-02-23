import cron from "node-cron";
import { sendMail } from "./emails";
import { generateReportEmail } from "../templates/emails";
import { Field } from "../database/models";
import { User } from "../database/models/user";

function initJob() {
  cron.schedule("0 9 * * *", async () => {
    const date = new Date(new Date().getTime() - 1000 * 60 * 60 * 24);
    const fields = await Field.find();

    for (const field of fields) {
      const user = await User.findById(field.userId);
      if (!user) continue;
      const emailContent = generateReportEmail({
        name: user.name,
        fieldName: field.fieldName,
        date,
      });
      await sendMail(user.email, "Relatório Diário AGRI-ARO", emailContent);
    }
  });
}

export { initJob };
