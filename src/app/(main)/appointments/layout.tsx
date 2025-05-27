export const metadata = {
  title: "Appointments - HealthTrack",
  description: "Manage your healthcare appointments",
};

export default function AppointmentsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <div className="h-full">{children}</div>;
}
