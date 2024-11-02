"use client"
import styles from "@/styles/Admin.module.css";
import { RxDashboard } from "react-icons/rx";
import { LuUpload } from "react-icons/lu";
import { FiBox } from "react-icons/fi";
import { FiTruck } from "react-icons/fi";
import { FiFrown } from "react-icons/fi";
import { LuRepeat } from "react-icons/lu";
import Link from "next/link";

export default function Admin({children}) {
  return (
    <div className="flex">
      {/* <div className={styles.sideBar}>
        <li className={styles.sideBarItem}>
          <Link href={"/auth/admin/dashboard"} className={styles.sideBarItems}>
            <RxDashboard size={30} />
            <p>DashBoard</p>
          </Link>
        </li>
        <li className={styles.sideBarItem}>
          <Link href={"/auth/admin/orders"} className={styles.sideBarItems}>
            <FiTruck size={30} />
            <p>Orders</p>
          </Link>
        </li>
        <li className={styles.sideBarItem}>
          <Link href={"/auth/admin/exchange"} className={styles.sideBarItems}>
            <LuRepeat size={30} />
            <p>Exchange</p>
          </Link>
        </li>
        <li className={styles.sideBarItem}>
          <Link href={"/auth/admin/upload-product"} className={styles.sideBarItems}>
            <LuUpload size={30} />
            <p>Upload Product</p>
          </Link>
        </li>
        <li className={styles.sideBarItem}>
          <Link href={"/auth/admin/inventory"} className={styles.sideBarItems}>
            <FiBox size={30} />
            <p>Inventory</p>
          </Link>
        </li>
        <li className={styles.sideBarItem}>
          <Link href={"/auth/admin/complains"} className={styles.sideBarItems}>
            <FiFrown size={30} />
            <p>Complains</p>
          </Link>
        </li>
      </div> */}
    {children}
    </div>
  );
}
