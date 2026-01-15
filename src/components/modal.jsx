import { IoIosCloseCircle } from "react-icons/io";

export default function modal({ onClose, children }) {

  return (
    <div className="modal-overlay" onClick={() => onClose(false)}>
      <div className="modal-wrapper">
        <div className="modal-content" onClick={e => e.stopPropagation()}>
          {children}
          <button className="modal-close" onClick={() => onClose(false)}>
            <IoIosCloseCircle size={40} />
          </button>
        </div>
      </div>
    </div>
  )
}
