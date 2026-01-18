export default function formField({ name, type, rows, cols, onChange, value, placeholder, required }) {
  return <div className="form-field">
    <label htmlFor={name}>{name}</label>
    {type === 'textarea' ? (
      <textarea
        type={type}
        name={name}
        id={name}
        placeholder={placeholder}
        rows={rows}
        cols={cols}
        value={value}
        onChange={onChange}
        required={required}
      ></textarea>
    ) : (
      <input type={type}
        name={name}
        id={name}
        placeholder={placeholder}
        value={type !== 'file' ? value : undefined}
        onChange={onChange}
        required={required}
      />
    )}
  </div>
}