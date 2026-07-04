interface Props {
  children: React.ReactNode;
}

export default function PageContainer({ children }: Props) {
  return (
    <div className="space-y-6">
      {children}
    </div>
  );
}