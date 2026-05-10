const EmptyState = ({ icon='📭', title='No data found', message='Nothing to show here yet.' }) => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <div className="text-6xl mb-4">{icon}</div>
    <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
    <p className="text-gray-500 text-sm max-w-xs">{message}</p>
  </div>
)
export default EmptyState
