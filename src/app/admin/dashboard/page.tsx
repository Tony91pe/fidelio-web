export default function AdminDashboard() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-gray-500 text-sm">Total Users</div>
          <div className="text-3xl font-bold">1,234</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-gray-500 text-sm">Active Shops</div>
          <div className="text-3xl font-bold">567</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-gray-500 text-sm">Active Plans</div>
          <div className="text-3xl font-bold">342</div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="text-gray-500 text-sm">Revenue</div>
          <div className="text-3xl font-bold">€12,345</div>
        </div>
      </div>
    </div>
  )
}
