"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useSidebar } from "../context/SidebarContext";
import {
  BoxCubeIcon,
  CalenderIcon,
  ChevronDownIcon,
  GridIcon,
  HorizontaLDots,
  ListIcon,
  PageIcon,
  PieChartIcon,
  TableIcon,
  UserCircleIcon,
} from "../icons/index";

type NavItem = {
  name: string;
  icon: React.ReactNode;
  path?: string;
  subItems?: { name: string; path: string; pro?: boolean; new?: boolean }[];
};

const navItems: NavItem[] = [
  {
    icon: <GridIcon />,
    name: "Dashboard",
    path: "/dashboard",
  },
  {
    icon: <CalenderIcon />,
    name: "Transaksi Kas",
    path: "/transaksi-kas",
  },
  {
    icon: <UserCircleIcon />,
    name: "Admin",
    subItems: [
      { name: "Daftar Akun", path: "account-center", pro: false },
      { name: "Daftar Perumahan", path: "perumahan", pro: false },
    ],
  },
  {
    icon: <BoxCubeIcon />,
    name: "Search",
    subItems: [
      { name: "Search Stock", path: "/search/stock", pro: false },
      { name: "Search Gudang In", path: "/search/gudangIn", pro: false },
      { name: "Search Gudang Out", path: "/search/gudangOut", pro: false },
    ],
  },
  {
    icon: <PieChartIcon />,
    name: "Approval",
    subItems: [
      { name: "Approval Transaksi Kas", path: "/approval-transaksi-kas", pro: false },
      { name: "Approval Gudang Input", path: "/approval-gudang-input", pro: false },
      // { name: "Approval Gudang Output", path: "/approval-gudang-output", pro: false },
      { name: "Kwitansi", path: "/kwitansi", pro: false },
      { name: "Kwitansi Gudang In ", path: "/kwitansi-gudangIn", pro: false },
    ],
  },
  {
    name: "Material Inventory",
    icon: <ListIcon />,
    subItems: [
      { name: "Managemen Stock Material", path: "/Managemen-Stock-Material", pro: false },
      { name: "Stock Material Gudang", path: "/Stock-Material-Gudang", pro: false },
      { name: "Menu Barang Diterima", path: "/gudang-input", pro: false },
      { name: "Barang Keluar", path: "/gudang-output", pro: false },
      { name: "Buat Stock", path: "/create-stock", pro: false },
    ],
  },
  {
    name: "Stok Rumah & Penjualan",
    icon: <TableIcon />,
    subItems: [
      { name: "Tipe Rumah", path: "/tipe-rumah", pro: false },
      { name: "Blok & Jumlah", path: "/blok", pro: false },
      { name: "Unit", path: "/unit", pro: false },
    ],
  },
  {
    name: "Manajemen Penjualan",
    icon: <TableIcon />,
    subItems: [
      { name: "Users", path: "/users", pro: false },
      { name: "Penjualan", path: "/penjualan", pro: false },
      { name: "Status Penjualan", path: "/status", pro: false },
    ],
  },
  {
    name: "Laporan",
    icon: <PageIcon />,
    subItems: [
      { name: "Laporan Bulanan", path: "/laporan-bulanan", pro: false },
      { name: "Laporan Tahunan", path: "/laporan-tahunan", pro: false },
      { name: "Cost Center", path: "/cost-center", pro: false },
      { name: "Cost Element", path: "/cost-element", pro: false },
      { name: "Cost Tee", path: "/cost-tee", pro: false },
    ],
  },
];

const AppSidebar: React.FC = () => {
  const { isExpanded, isMobileOpen, isHovered, setIsHovered } = useSidebar();
  const pathname = usePathname();

  const [openSubmenu, setOpenSubmenu] = useState<{ index: number } | null>(null);
  const [subMenuHeight, setSubMenuHeight] = useState<Record<string, number>>({});
  const subMenuRefs = useRef<Record<string, HTMLDivElement | null>>({});

  const isActive = useCallback((path: string) => path === pathname, [pathname]);

  const handleSubmenuToggle = (index: number) => {
    setOpenSubmenu((prev) => (prev?.index === index ? null : { index }));
  };

  const renderMenuItems = (items: NavItem[]) => (
    <ul className="flex flex-col gap-4">
      {items.map((nav, index) => (
        <li key={nav.name}>
          {nav.subItems ? (
            <button
              onClick={() => handleSubmenuToggle(index)}
              className={`menu-item group ${
                openSubmenu?.index === index ? "menu-item-active" : "menu-item-inactive"
              } cursor-pointer ${!isExpanded && !isHovered ? "lg:justify-center" : "lg:justify-start"}`}
            >
              <span className={`${openSubmenu?.index === index ? "menu-item-icon-active" : "menu-item-icon-inactive"}`}>
                {nav.icon}
              </span>
              {(isExpanded || isHovered || isMobileOpen) && <span className="menu-item-text">{nav.name}</span>}
              {(isExpanded || isHovered || isMobileOpen) && (
                <ChevronDownIcon
                  className={`ml-auto w-5 h-5 transition-transform duration-200 ${
                    openSubmenu?.index === index ? "rotate-180 text-brand-500" : ""
                  }`}
                />
              )}
            </button>
          ) : (
            nav.path && (
              <Link
                href={nav.path}
                className={`menu-item group ${isActive(nav.path) ? "menu-item-active" : "menu-item-inactive"}`}
              >
                <span className={`${isActive(nav.path) ? "menu-item-icon-active" : "menu-item-icon-inactive"}`}>
                  {nav.icon}
                </span>
                {(isExpanded || isHovered || isMobileOpen) && <span className="menu-item-text">{nav.name}</span>}
              </Link>
            )
          )}

          {nav.subItems && (isExpanded || isHovered || isMobileOpen) && (
            <div
              ref={(el) => {
                subMenuRefs.current[`main-${index}`] = el;
              }}
              className="overflow-hidden transition-all duration-300"
              style={{
                height: openSubmenu?.index === index ? `${subMenuHeight[`main-${index}`]}px` : "0px",
              }}
            >
              <ul className="mt-2 space-y-1 ml-9">
                {nav.subItems.map((subItem) => (
                  <li key={subItem.name}>
                    <Link
                      href={subItem.path}
                      className={`menu-dropdown-item ${
                        isActive(subItem.path)
                          ? "menu-dropdown-item-active"
                          : "menu-dropdown-item-inactive"
                      }`}
                    >
                      {subItem.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </li>
      ))}
    </ul>
  );

  useEffect(() => {
    navItems.forEach((nav, index) => {
      if (nav.subItems) {
        nav.subItems.forEach((subItem) => {
          if (isActive(subItem.path)) {
            setOpenSubmenu({ index });
          }
        });
      }
    });
  }, [pathname, isActive]);

  useEffect(() => {
    if (openSubmenu !== null) {
      const key = `main-${openSubmenu.index}`;
      if (subMenuRefs.current[key]) {
        setSubMenuHeight((prev) => ({
          ...prev,
          [key]: subMenuRefs.current[key]?.scrollHeight || 0,
        }));
      }
    }
  }, [openSubmenu]);

  return (
    <aside
      className={`fixed mt-16 flex flex-col lg:mt-0 top-0 px-5 left-0 bg-white dark:bg-gray-900 dark:border-gray-800 text-gray-900 h-screen transition-all duration-300 ease-in-out z-50 border-r border-gray-200 
        ${isExpanded || isMobileOpen ? "w-[290px]" : isHovered ? "w-[290px]" : "w-[90px]"}
        ${isMobileOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0`}
      onMouseEnter={() => !isExpanded && setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className={`py-8 flex items-center ${!isExpanded && !isHovered ? "lg:justify-center" : "justify-start"}`}>
        <Link href="/dashboard" className="flex items-center justify-center w-full">
          <span className={`transition-opacity duration-300 ${isMobileOpen ? "opacity-0" : "opacity-100"}`}>
            {isExpanded || isHovered ? (
              <>
                <Image className="dark:hidden mx-auto" src="/images/logo/icon.png" alt="Logo" width={90} height={40} />
                <Image className="hidden dark:block mx-auto" src="/images/logo/icon.png" alt="Logo" width={90} height={40} />
              </>
            ) : (
              <Image className="mx-auto" src="/images/logo/icon.png" alt="Logo" width={32} height={32} />
            )}
          </span>
        </Link>
      </div>
      <div className="flex flex-col overflow-y-auto duration-300 ease-linear no-scrollbar">
        <nav className="mb-6">
          <div className="flex flex-col gap-4">
            <div>
              <h2
                className={`mb-4 text-xs uppercase flex leading-[20px] text-gray-400 ${
                  !isExpanded && !isHovered ? "lg:justify-center" : "justify-start"
                }`}
              >
                {isExpanded || isHovered || isMobileOpen ? "Menu" : <HorizontaLDots />}
              </h2>
              {renderMenuItems(navItems)}
            </div>
          </div>
        </nav>
      </div>
    </aside>
  );
};

export default AppSidebar;
