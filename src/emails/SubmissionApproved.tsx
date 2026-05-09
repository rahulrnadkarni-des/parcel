import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Link,
  Preview,
  Text,
} from "@react-email/components";

interface SubmissionApprovedEmailProps {
  restaurantName: string;
  libraryUrl: string;
}

export default function SubmissionApprovedEmail({
  restaurantName,
  libraryUrl,
}: SubmissionApprovedEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>Your submission for {restaurantName} is live on Parcel</Preview>
      <Body style={{ fontFamily: "sans-serif", backgroundColor: "#f9f9f9" }}>
        <Container style={{ maxWidth: 480, margin: "40px auto", backgroundColor: "#fff", padding: 32, borderRadius: 8 }}>
          <Heading style={{ fontSize: 20 }}>Your bag has been found.</Heading>
          <Text>
            Your submission for <strong>{restaurantName}</strong> passed review and is now live in the Parcel library.
            Someone out there will find their bag faster because of you.
          </Text>
          <Link href={libraryUrl} style={{ display: "inline-block", marginTop: 16, backgroundColor: "#000", color: "#fff", padding: "10px 20px", borderRadius: 6, textDecoration: "none" }}>
            See it in the library →
          </Link>
          <Text style={{ color: "#999", fontSize: 12, marginTop: 32 }}>
            You received this because you left your email when submitting.
          </Text>
        </Container>
      </Body>
    </Html>
  );
}
