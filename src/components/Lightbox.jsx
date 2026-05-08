export default function Lightbox({ src, alt, onClose }) {
  return (
    <div className="lightbox-overlay" onClick={onClose}>
      <img
        src={src}
        alt={alt}
        className="lightbox-img"
        onClick={e => e.stopPropagation()}
      />
    </div>
  )
}
