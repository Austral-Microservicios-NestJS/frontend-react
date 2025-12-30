import { useSidebarStore } from "@/store/sidebar.store";

export const useSidebar = () => {
  const { isSidebarOpen, toggleSidebar } = useSidebarStore();
  return { isSidebarOpen, toggleSidebar };
};
