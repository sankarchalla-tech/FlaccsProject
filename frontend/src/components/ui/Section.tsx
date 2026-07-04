interface SectionProps {

  title?: string;

  children: React.ReactNode;
}

export default function Section({

  title,

  children,

}: SectionProps) {

  return (

    <section className="space-y-4">

      {title && (

        <h2 className="text-xl font-semibold text-slate-800">

          {title}

        </h2>

      )}

      {children}

    </section>

  );
}