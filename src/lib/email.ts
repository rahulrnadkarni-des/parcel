import { Resend } from "resend";
import { render } from "@react-email/components";
import NewSubmissionEmail from "@/emails/NewSubmission";
import SubmissionApprovedEmail from "@/emails/SubmissionApproved";
import SubmissionRejectedEmail from "@/emails/SubmissionRejected";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM = "Parcel <noreply@parcel.community>";
const ADMIN_EMAIL = process.env.ADMIN_EMAIL!;
const APP_URL = process.env.NEXT_PUBLIC_APP_URL!;

export async function sendNewSubmissionAlert(params: {
  restaurantName: string;
  areaName: string;
  bagType: string;
  primaryColor: string;
  photoUrl: string;
  submitterEmail?: string;
}) {
  const html = await render(
    NewSubmissionEmail({
      ...params,
      adminQueueUrl: `${APP_URL}/admin/queue`,
    })
  );

  await resend.emails.send({
    from: FROM,
    to: ADMIN_EMAIL,
    subject: `New submission: ${params.restaurantName} · ${params.areaName}`,
    html,
  });
}

export async function sendApprovalEmail(params: {
  to: string;
  restaurantName: string;
  restaurantSlug: string;
}) {
  const html = await render(
    SubmissionApprovedEmail({
      restaurantName: params.restaurantName,
      libraryUrl: `${APP_URL}/restaurant/${params.restaurantSlug}`,
    })
  );

  await resend.emails.send({
    from: FROM,
    to: params.to,
    subject: `Your submission for ${params.restaurantName} is live on Parcel`,
    html,
  });
}

export async function sendRejectionEmail(params: {
  to: string;
  restaurantName: string;
  reason?: string;
}) {
  const html = await render(
    SubmissionRejectedEmail({
      restaurantName: params.restaurantName,
      reason: params.reason,
    })
  );

  await resend.emails.send({
    from: FROM,
    to: params.to,
    subject: `Update on your Parcel submission`,
    html,
  });
}
