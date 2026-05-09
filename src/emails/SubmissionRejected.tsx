import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Text,
} from "@react-email/components";

interface SubmissionRejectedEmailProps {
  restaurantName: string;
  reason?: string;
}

export default function SubmissionRejectedEmail({
  restaurantName,
  reason,
}: SubmissionRejectedEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Update on your Parcel submission for {restaurantName}</Preview>
      <Body style={{ fontFamily: "sans-serif", backgroundColor: "#f9f9f9" }}>
        <Container style={{ maxWidth: 480, margin: "40px auto", backgroundColor: "#fff", padding: 32, borderRadius: 8 }}>
          <Heading style={{ fontSize: 20 }}>Update on your submission</Heading>
          <Text>
            Your submission for <strong>{restaurantName}</strong> wasn&apos;t approved this time —
            usually because the photo was unclear or the packaging details didn&apos;t match.
          </Text>
          {reason && (
            <Text style={{ backgroundColor: "#f4f4f4", padding: "12px 16px", borderRadius: 6, fontSize: 14 }}>
              {reason}
            </Text>
          )}
          <Text>
            If you have a clearer photo, feel free to submit again. Every bag matters.
          </Text>
          <Text style={{ color: "#999", fontSize: 12, marginTop: 32 }}>
            You received this because you left your email when submitting.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
