export default function ColorPicker({ value, onChange }) {
  return (
    <label>
      Target Color:
      <input type="color" value={value} onChange={e => onChange(e.target.value)} />
    </label>
  );
}