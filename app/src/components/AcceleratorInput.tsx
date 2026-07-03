// Campo de quantidade para um tipo de acelerador. A unidade (dias/horas/
// minutos) é compartilhada entre todos os tipos e controlada pelo
// componente pai (SnapshotForm) — aqui só entra o número.

export default function AcceleratorInput({
  label,
  value,
  onChange,
}: {
  label: string
  value: number
  onChange: (amount: number) => void
}) {
  return (
    <div>
      <label className="muted">{label}</label>
      <input
        type="number"
        min={0}
        value={value}
        onChange={(e) => onChange(Number(e.target.value) || 0)}
      />
    </div>
  )
}
