"use client";
import { useEffect, useState } from "react";
import { getOrders } from "../lib/supabase";
import OrderTable from "../components/OrderTable";
import {
  Package,
  DollarSign,
  CheckCircle,
  Clock,
  Loader2,
  AlertCircle,
  TrendingUp,
  Award,
  Users,
  ShoppingBag,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";

function OrderStats({ orders }) {
  const totalOrders = orders.length;
  const totalRevenue = orders.reduce(
    (sum, order) => sum + (order.total_amount_vat || 0),
    0
  );
  const completedOrders = orders.filter(
    (order) => order.status === "completed"
  ).length;
  const pendingOrders = orders.filter(
    (order) => order.status === "pending"
  ).length;

  const metrics = [
    {
      name: "Total Orders",
      value: totalOrders,
      icon: <Package size={24} />,
      gradient: "from-blue-500 to-blue-600",
      iconBg: "bg-blue-500/20",
      trend: "+12%",
    },
    {
      name: "Total Revenue",
      value: `UGX ${totalRevenue.toLocaleString(undefined, {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      })}`,
      icon: <DollarSign size={24} />,
      gradient: "from-emerald-500 to-emerald-600",
      iconBg: "bg-emerald-500/20",
      trend: "+8.3%",
    },
    {
      name: "Completed Orders",
      value: completedOrders,
      icon: <CheckCircle size={24} />,
      gradient: "from-purple-500 to-purple-600",
      iconBg: "bg-purple-500/20",
      trend: "+5%",
    },
    {
      name: "Pending Orders",
      value: pendingOrders,
      icon: <Clock size={24} />,
      gradient: "from-amber-500 to-amber-600",
      iconBg: "bg-amber-500/20",
      trend: "-2%",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {metrics.map((metric) => (
        <div
          key={metric.name}
          className={`p-6 bg-gradient-to-br ${metric.gradient} rounded-2xl text-white shadow-lg transform hover:scale-105 transition-all duration-300`}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium opacity-90">{metric.name}</p>
              <p className="text-2xl mt-1 font-bold">{metric.value}</p>
              <div className="flex items-center mt-2">
                <span className="mr-1 text-white/80">
                  {metric.trend.startsWith("+") ? (
                    <ArrowUp size={14} />
                  ) : (
                    <ArrowDown size={14} />
                  )}
                </span>
                <span className="text-xs font-medium">{metric.trend}</span>
              </div>
            </div>
            <div className={`p-3 rounded-full ${metric.iconBg}`}>
              {metric.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function SalesTrendChart({ timeFrame }) {
  const dailyData = [
    { name: "Mon", sales: 4000 },
    { name: "Tue", sales: 3000 },
    { name: "Wed", sales: 5000 },
    { name: "Thu", sales: 2780 },
    { name: "Fri", sales: 1890 },
    { name: "Sat", sales: 6390 },
    { name: "Sun", sales: 3490 },
  ];

  const weeklyData = [
    { name: "Week 1", sales: 24000 },
    { name: "Week 2", sales: 18000 },
    { name: "Week 3", sales: 32000 },
    { name: "Week 4", sales: 27000 },
  ];

  const monthlyData = [
    { name: "Jan", sales: 65000 },
    { name: "Feb", sales: 59000 },
    { name: "Mar", sales: 80000 },
    { name: "Apr", sales: 81000 },
    { name: "May", sales: 56000 },
    { name: "Jun", sales: 55000 },
    { name: "Jul", sales: 40000 },
  ];

  let data =
    timeFrame === "daily"
      ? dailyData
      : timeFrame === "weekly"
      ? weeklyData
      : monthlyData;
  let title =
    timeFrame === "daily"
      ? "Daily Sales"
      : timeFrame === "weekly"
      ? "Weekly Sales"
      : "Monthly Sales";

  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100/50">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800">{title}</h3>
        <div className="text-emerald-500 flex items-center text-sm font-medium bg-emerald-50 px-3 py-1 rounded-full">
          <TrendingUp size={16} className="mr-1" />
          +12.5%
        </div>
      </div>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" stroke="#6b7280" fontSize={12} />
            <YAxis stroke="#6b7280" fontSize={12} />
            <Tooltip
              contentStyle={{
                background: "#ffffff",
                border: "none",
                borderRadius: "12px",
                boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                padding: "10px",
              }}
              formatter={(value) => [`UGX ${value.toLocaleString()}`, "Sales"]}
            />
            <Line
              type="monotone"
              dataKey="sales"
              stroke="#8B5CF6"
              strokeWidth={3}
              dot={{ r: 5, fill: "#8B5CF6", strokeWidth: 0 }}
              activeDot={{
                r: 8,
                fill: "#fff",
                stroke: "#8B5CF6",
                strokeWidth: 2,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}

function PaymentSummary() {
  const paymentData = [
    { name: "Mobile Money", value: 65 },
    { name: "Bank Transfer", value: 20 },
    { name: "Cash", value: 10 },
    { name: "Credit Card", value: 5 },
  ];

  const COLORS = ["#8B5CF6", "#10B981", "#F59E0B", "#3B82F6"];

  return (
    <div className="bg-gradient-to-br from-gray-900 to-gray-800 p-6 rounded-2xl shadow-lg text-white">
      <h3 className="text-xl font-semibold mb-6">Payment Methods</h3>
      <div className="flex items-center">
        <div className="w-1/2 h-72">
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={paymentData}
                cx="50%"
                cy="50%"
                innerRadius={70}
                outerRadius={90}
                paddingAngle={5}
                dataKey="value"
              >
                {paymentData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value) => [`${value}%`, "Percentage"]}
                contentStyle={{
                  background: "#fff",
                  border: "none",
                  borderRadius: "12px",
                  boxShadow: "0 4px 15px rgba(0,0,0,0.1)",
                  color: "#1f2937",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="w-1/2 pl-6">
          {paymentData.map((item, index) => (
            <div key={item.name} className="flex items-center mb-4">
              <div
                className="w-3 h-3 rounded-full mr-3"
                style={{ backgroundColor: COLORS[index] }}
              ></div>
              <div className="flex justify-between w-full">
                <span className="text-sm opacity-90">{item.name}</span>
                <span className="text-sm font-medium">{item.value}%</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function InvoiceSummary() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100/50">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800">Invoice Status</h3>
        <button className="text-indigo-600 text-sm font-medium hover:text-indigo-700 transition-colors">
          View All
        </button>
      </div>
      <div className="space-y-5">
        {[
          { label: "Total Invoices", value: "85", color: "text-gray-600" },
          { label: "Paid", value: "62", color: "text-emerald-600" },
          { label: "Pending", value: "18", color: "text-amber-600" },
          { label: "Overdue", value: "5", color: "text-red-600" },
        ].map((item) => (
          <div key={item.label} className="flex justify-between">
            <span className="text-gray-600">{item.label}</span>
            <span className={`font-semibold ${item.color}`}>{item.value}</span>
          </div>
        ))}
      </div>
      <div className="mt-6 pt-6 border-t border-gray-100">
        <div className="h-3 w-full bg-gray-100 rounded-full overflow-hidden">
          <div className="flex h-full">
            <div className="bg-emerald-500 w-3/5 rounded-l-full"></div>
            <div className="bg-amber-500 w-1/5"></div>
            <div className="bg-red-500 w-1/12 rounded-r-full"></div>
          </div>
        </div>
        <div className="flex justify-between mt-2 text-xs text-gray-600">
          <span>73% Paid</span>
          <span>21% Pending</span>
          <span>6% Overdue</span>
        </div>
      </div>
    </div>
  );
}

function RewardsSummary() {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-lg border border-gray-100/50">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-xl font-semibold text-gray-800">
          Customer Rewards
        </h3>
        <button className="text-indigo-600 text-sm font-medium hover:text-indigo-700 transition-colors">
          Manage Rewards
        </button>
      </div>
      <div className="space-y-6">
        {[
          {
            name: "Loyalty Points",
            value: "12,580",
            icon: <Award size={20} />,
            gradient: "from-purple-500 to-purple-600",
          },
          {
            name: "Points Redeemed",
            value: "4,230",
            icon: <ShoppingBag size={20} />,
            gradient: "from-amber-500 to-amber-600",
          },
          {
            name: "Active Promotions",
            value: "7",
            icon: <TrendingUp size={20} />,
            gradient: "from-blue-500 to-blue-600",
          },
          {
            name: "Top Customers",
            value: "25",
            icon: <Users size={20} />,
            gradient: "from-emerald-500 to-emerald-600",
          },
        ].map((item) => (
          <div key={item.name} className="flex items-center">
            <div
              className={`p-3 rounded-xl bg-gradient-to-br ${item.gradient} text-white`}
            >
              {item.icon}
            </div>
            <div className="ml-4">
              <p className="text-sm text-gray-600">{item.name}</p>
              <p className="text-lg font-semibold text-gray-800">
                {item.value}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function TimeFrameSelector({ timeFrame, setTimeFrame }) {
  return (
    <div className="inline-flex bg-white rounded-xl p-1.5 shadow-sm border border-gray-100">
      {["daily", "weekly", "monthly"].map((option) => (
        <button
          key={option}
          className={`px-5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
            timeFrame === option
              ? "bg-indigo-600 text-white shadow-md"
              : "text-gray-600 hover:bg-gray-100"
          }`}
          onClick={() => setTimeFrame(option)}
        >
          {option.charAt(0).toUpperCase() + option.slice(1)}
        </button>
      ))}
    </div>
  );
}

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeFrame, setTimeFrame] = useState("daily");

  useEffect(() => {
    async function fetchOrders() {
      try {
        const { data, error } = await getOrders();
        if (error) throw error;
        setOrders(data || []);
      } catch (err) {
        setError(err.message || "Unknown error occurred");
      } finally {
        setLoading(false);
      }
    }
    fetchOrders();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <main className="p-4 md:p-8">
        <div className="max-w-7xl mx-auto space-y-8">
          {loading ? (
            <div className="flex justify-center items-center py-24">
              <div className="text-center">
                <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mx-auto" />
                <p className="mt-4 text-gray-600 font-medium">
                  Loading dashboard...
                </p>
              </div>
            </div>
          ) : error ? (
            <div className="bg-red-50 border-l-4 border-red-500 text-red-700 p-6 rounded-lg flex items-center space-x-3">
              <AlertCircle className="w-6 h-6" />
              <div>
                <span className="font-semibold">Error:</span> {error}
              </div>
            </div>
          ) : (
            <>
              <div>
                <h2 className="text-2xl font-bold text-gray-800 mb-6">
                  Dashboard Overview
                </h2>
                <OrderStats orders={orders} />
              </div>

              <TimeFrameSelector
                timeFrame={timeFrame}
                setTimeFrame={setTimeFrame}
              />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <SalesTrendChart timeFrame={timeFrame} />
                <PaymentSummary />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <InvoiceSummary />
                <RewardsSummary />
              </div>

              <div className="bg-white rounded-2xl shadow-lg border border-gray-100 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100">
                  <h2 className="text-xl font-semibold text-gray-800">
                    Recent Orders
                  </h2>
                  <p className="text-sm text-gray-500 mt-1">
                    Showing last {Math.min(orders.length, 10)} of{" "}
                    {orders.length} orders
                  </p>
                </div>
                <OrderTable orders={orders.slice(0, 6)} />
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
