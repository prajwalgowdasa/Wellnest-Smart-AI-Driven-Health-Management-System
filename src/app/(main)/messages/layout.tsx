export const metadata = {
  title: "Messages - HealthTrack",
  description: "Chat with healthcare providers",
};

export default function MessagesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="h-full">{children}</div>;
}
