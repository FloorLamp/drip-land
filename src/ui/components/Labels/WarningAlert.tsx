export default function WarningAlert({ children }) {
  return (
    <div
      className="px-2 py-1 rounded-sm bg-yellow-100 text-yellow-700"
      role="alert"
    >
      {children}
    </div>
  );
}
