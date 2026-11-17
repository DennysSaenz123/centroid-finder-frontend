export default function ColorPicker({ value, onChange, disabled }) {
  return (
    <label className="color-picker">
      Target color
      <input
        type="color"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
      />
      <code>{value}</code>
    </label>
  );
}