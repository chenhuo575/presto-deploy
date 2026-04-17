interface ErrorPopupProps {
    message: string;
    onClose: () => void;
  }
  
const ErrorPopup=({ message, onClose }: ErrorPopupProps) => {
  if (!message) return null;

  return (
    <div style={{
      position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex', justifyContent: 'center', alignItems: 'center',
      zIndex: 1000
    }}>
      <div style={{
        backgroundColor: 'white', padding: '24px', borderRadius: '8px',
        minWidth: '300px', textAlign: 'center'
      }}>
        <p style={{ color: 'red'}}>{message}</p>
        <button onClick={onClose}>✕ Close</button>
      </div>
    </div>
  );
};

export default ErrorPopup;