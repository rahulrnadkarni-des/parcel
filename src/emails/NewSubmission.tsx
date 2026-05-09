import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from "@react-email/components";

interface NewSubmissionEmailProps {
  restaurantName: string;
  areaName: string;
  bagType: string;
  primaryColor: string;
  photoUrl: string;
  submitterEmail?: string;
  adminQueueUrl: string;
}

export default function NewSubmissionEmail({
  restaurantName,
  areaName,
  bagType,
  primaryColor,
  photoUrl,
  submitterEmail,
  adminQueueUrl,
}: NewSubmissionEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>New submission: {restaurantName} · {areaName}</Preview>
      <Body style={{ fontFamily: "sans-serif", backgroundColor: "#f9f9f9" }}>
        <Container style={{ maxWidth: 480, margin: "40px auto", backgroundColor: "#fff", padding: 32, borderRadius: 8 }}>
          <Heading style={{ fontSize: 20, marginBottom: 4 }}>New submission</Heading>
          <Text style={{ color: "#666", marginTop: 0 }}>{restaurantName} · {areaName}</Text>
          <Img src={photoUrl} alt="Packaging photo" width={420} style={{ borderRadius: 6, marginBottom: 16 }} />
          <Section>
            <Text style={{ margin: "4px 0" }}><strong>Bag type:</strong> {bagType}</Text>
            <Text style={{ margin: "4px 0" }}><strong>Primary colour:</strong> {primaryColor}</Text>
            {submitterEmail && (
              <Text style={{ margin: "4px 0" }}><strong>Submitter:</strong> {submitterEmail}</Text>
            )}
          </Section>
          <Link href={adminQueueUrl} style={{ display: "inline-block", marginTop: 24, backgroundColor: "#000", color: "#fff", padding: "10px 20px", borderRadius: 6, textDecoration: "none" }}>
            Review in admin →
          </Link>
        </Container>
      </Body>
    </Html>
  );
}
