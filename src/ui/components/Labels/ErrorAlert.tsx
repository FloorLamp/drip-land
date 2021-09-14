export default function ErrorAlert({ children }) {
  return (
    <div className="px-2 py-1 rounded-sm bg-red-100 text-red-700" role="alert">
      {children}
    </div>
  );
}
