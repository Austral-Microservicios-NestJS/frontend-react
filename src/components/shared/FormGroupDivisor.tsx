

interface FormGroupDivisorProps {
  children: React.ReactNode;
  columns?: 2 | 3;
}

export const FormGroupDivisor = ({ children, columns = 2 }: FormGroupDivisorProps) => {
  return (
    <div className={columns === 3 ? 'grid grid-cols-1 md:grid-cols-3 gap-4' : 'grid grid-cols-1 md:grid-cols-2 gap-4'}>
        {children}
    </div>
  )
}
