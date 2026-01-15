export default function formField({name, type, rows, cols, onChange, value}) {
    return <div className="form-field">
        <label htmlFor={name}>{name}</label>
        {type === 'textarea' ? (
            <textarea 
                type={type} 
                name={name} 
                id={name} 
                placeholder={name} 
                rows={rows}
                cols={cols}
                value={value}
                onChange={onChange}
            ></textarea>
        ) : (
            <input type={type} 
                name={name} 
                id={name} 
                placeholder={name} 
                value={type !== 'file' ? value : undefined}
                onChange={onChange}
            />
        )}
    </div>
}