 import { useEffect, useState } from "react";
import { getMenus } from "../Api/menu";
import { useNavigate, useLocation, useParams } from "react-router-dom";

import {
  LayoutDashboard,
  Building2,
  Users,
  Bus,
  MapPinned,
  Truck,
  IndianRupee,
  BarChart3,
  Settings,
  ChevronDown,
  PanelLeftClose,
  PanelLeftOpen,
  ClipboardPlus,
  Building,
  BadgeIndianRupee,
  UserCog,
  Car,
  GraduationCap,
  Route,
  Map,
  Package,
  CircleCheck,
  Receipt,
  Wallet,
} from "lucide-react";

import "../assets/CSS/sidebar.css";

const icons = {
  LayoutDashboard,
  Building2,
  Users,
  Bus,
  MapPinned,
  Truck,
  IndianRupee,
  BarChart3,
  Settings,
  ClipboardPlus,
  Building,
  BadgeIndianRupee,
  UserCog,
  Car,
  GraduationCap,
  Route,
  Map,
  Package,
  CircleCheck,
  Receipt,
  Wallet,
};

export default function Sidebar({
  collapsed,
  setCollapsed,
}) {

  const { role_id, company_type_id } = useParams();

  const [menus, setMenus] = useState([]);
  const [openMenu, setOpenMenu] = useState(null);

  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {

    if (!role_id) return;

    fetchMenus();

  }, [role_id, company_type_id]);

  const fetchMenus = async () => {

    try {

      const response = await getMenus({
        role_id,
        company_type_id
      });

      console.log("Fetched menus:", response); // Debugging log
      if (response.success) {
        setMenus(response.data);
      }

    } catch (err) {
      console.log(err);
    }

  };

  const handleNavigate = (path) => {
    if (path === "#") return;
    const normalizedPath = `/dashboard/${role_id}/${company_type_id}/${path.replace(/^\/+/, "")}`;
       navigate(normalizedPath);
  };

  const toggleMenu = (id) => {
    setOpenMenu(openMenu === id ? null : id);
  };

  const parentMenus = menus.filter(
    menu => menu.parent_id === null
  );

  const getChildMenus = (parentId) => {

    return menus.filter(
      menu => menu.parent_id === parentId
    );

  };

  return (

    <aside
      className={`sidebar ${
        collapsed ? "sidebar-collapsed" : ""
      }`}
    >

      <div className="sidebar-header">

        {!collapsed && (
          <h2>Fleet Transit</h2>
        )}

        <button
          className="toggle-btn"
          onClick={() =>
            setCollapsed(!collapsed)
          }
        >
          {collapsed ? (
            <PanelLeftOpen />
          ) : (
            <PanelLeftClose />
          )}
        </button>

      </div>

      <div className="menu-wrapper">

        {parentMenus.map(parent => {

          const Icon =
            icons[parent.icon];

          const childMenus =
            getChildMenus(parent.id);

          return (

            <div
              key={parent.id}
              className="menu-box"
            >

              <div
                className="parent-menu"
                onClick={() => {

                  if (childMenus.length) {

                    toggleMenu(parent.id);

                  } else {

                    handleNavigate(parent.path);

                  }

                }}
              >

                <div className="parent-left">

                  {Icon && (
                    <Icon size={20} />
                  )}

                  {!collapsed && (
                    <span>
                      {parent.name}
                    </span>
                  )}

                </div>

                {!collapsed &&
                  childMenus.length > 0 && (

                  <ChevronDown
                    className={
                      openMenu === parent.id
                        ? "rotate-icon"
                        : ""
                    }
                  />

                )}

              </div>

              {!collapsed &&
                openMenu === parent.id && (

                <div className="child-wrapper">

                  {childMenus.map(child => {

                    const active =
                      location.pathname.endsWith(
                        child.path
                      );

                    return (

                      <div
                        key={child.id}
                        className={`child-menu ${
                          active
                            ? "active-child"
                            : ""
                        }`}
                        onClick={() =>
                          handleNavigate(
                            child.path
                          )
                        }
                      >

                        {child.name}

                      </div>

                    );

                  })}

                </div>

              )}

            </div>

          );

        })}

      </div>

    </aside>

  );

}