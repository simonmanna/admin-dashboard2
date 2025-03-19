"use client";
// components/dashboard/Sidebar.js
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  ShoppingBag,
  Truck,
  Settings,
  Users,
  BarChart,
  ChevronDown,
  ChevronRight,
  Utensils,
  ShoppingCart,
  Star,
  MessageSquare,
  UserCheck,
  Folder,
  FileText,
  Bell,
  Shield,
  Package,
  List,
  PieChart,
  User,
  Clock,
  CheckCircle,
  CreditCard,
  ScrollText,
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState({});

  const toggleMenu = (label) => {
    setOpenMenus((prev) => ({
      ...prev,
      [label]: !prev[label],
    }));
  };

  const navItems = [
    {
      label: "Dashboard",
      href: "/dashboard",
      icon: <LayoutDashboard size={20} />,
    },
    {
      label: "Menu",
      icon: <Utensils size={20} />,
      subItems: [
        {
          label: "Menus",
          href: "/categories",
          icon: <ScrollText size={16} />,
        },
        { label: "All Menu", href: "/menu", icon: <List size={16} /> },
        { label: "Popular", href: "/popular-menu", icon: <Star size={16} /> },
        { label: "Addons", href: "/addons", icon: <Package size={16} /> },
        {
          label: "Choices",
          href: "/admin/menu-option-groups",
          icon: <FileText size={16} />,
        },
        { label: "Options", href: "/menu-options", icon: <List size={16} /> },
      ],
    },
    {
      label: "Orders",
      icon: <ShoppingCart size={20} />,
      subItems: [
        {
          label: "All Orders",
          href: "/orders",
          icon: <ShoppingBag size={16} />,
        },
        {
          label: "Pending",
          href: "/orders-pending",
          icon: <Clock size={16} />,
        },
        {
          label: "Completed",
          href: "/orders-completed",
          icon: <CheckCircle size={16} />,
        },
      ],
    },
    { label: "Deliveries", href: "/deliveries", icon: <Truck size={20} /> },
    { label: "Invoices", href: "/invoices", icon: <FileText size={20} /> },
    { label: "Payments", href: "/payments", icon: <CreditCard size={20} /> },
    { label: "Rewards", href: "/rewards", icon: <Star size={20} /> },
    {
      label: "Feedbacks",
      href: "/order-feedback",
      icon: <MessageSquare size={20} />,
    },
    { label: "Drivers", href: "/drivers", icon: <UserCheck size={20} /> },
    {
      label: "Reports",
      icon: <PieChart size={20} />,
      subItems: [
        {
          label: "All Reports",
          href: "/reports/orders-report",
          icon: <FileText size={16} />,
        },
        {
          label: "Invoices",
          href: "/invoices/reports",
          icon: <FileText size={16} />,
        },
        {
          label: "Completed",
          href: "/orders/completed",
          icon: <CheckCircle size={16} />,
        },
      ],
    },
    {
      label: "Analytics",
      icon: <BarChart size={20} />,
      subItems: [
        {
          label: "Sales",
          href: "/dashboard/analytics/sales",
          icon: <ShoppingCart size={16} />,
        },
        {
          label: "Customer",
          href: "/dashboard/analytics/customer",
          icon: <User size={16} />,
        },
        {
          label: "Performance",
          href: "/dashboard/analytics/performance",
          icon: <BarChart size={16} />,
        },
      ],
    },
    { label: "Users", href: "/dashboard/users", icon: <Users size={20} /> },
    {
      label: "Settings",
      icon: <Settings size={20} />,
      subItems: [
        {
          label: "General",
          href: "/dashboard/settings",
          icon: <Settings size={16} />,
        },
        {
          label: "Notifications",
          href: "/dashboard/settings/notifications",
          icon: <Bell size={16} />,
        },
        {
          label: "Security",
          href: "/dashboard/settings/security",
          icon: <Shield size={16} />,
        },
      ],
    },
  ];

  return (
    <div className="w-64 bg-gray-800 border-r text-white h-full overflow-y-auto">
      <div className="flex flex-col items-center py-4">
        <div className="h-16 w-16 bg-blue-600 rounded-full flex items-center justify-center mb-2">
          <span className="text-2xl font-extrabold">AP</span>
        </div>
        <h1 className="text-xl font-bold">AFROPARK Admin</h1>
      </div>
      <nav className="px-4 py-2">
        <ul>
          {navItems.map((item) => {
            const hasSubItems = item.subItems && item.subItems.length > 0;
            const isOpen = openMenus[item.label];

            return (
              <li key={item.label} className="mb-2">
                {hasSubItems ? (
                  <div>
                    <button
                      onClick={() => toggleMenu(item.label)}
                      className="flex items-center justify-between w-full p-3 rounded-lg text-sm hover:bg-gray-700"
                    >
                      <div className="flex items-center">
                        {item.icon}
                        <span className="ml-3">{item.label}</span>
                      </div>
                      {isOpen ? (
                        <ChevronDown size={16} />
                      ) : (
                        <ChevronRight size={16} />
                      )}
                    </button>
                    {isOpen && (
                      <ul className="ml-6 mt-1 space-y-1">
                        {item.subItems.map((sub) => (
                          <li key={sub.href} className="flex items-center">
                            {sub.icon}
                            <Link
                              href={sub.href}
                              className="ml-2 p-2 rounded-md text-sm hover:bg-gray-700"
                            >
                              {sub.label}
                            </Link>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                ) : (
                  <Link
                    href={item.href}
                    className="flex items-center p-3 rounded-lg text-sm hover:bg-gray-700"
                  >
                    {item.icon}
                    <span className="ml-3">{item.label}</span>
                  </Link>
                )}
              </li>
            );
          })}
        </ul>
      </nav>
    </div>
  );
}
