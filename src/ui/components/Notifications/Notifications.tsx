import React from "react";
import { useNotifications } from "../Store/Store";

export type NewNotification = any;
export type NotificationType = NewNotification & { id: string };

export const Notifications = () => {
  const { list, remove } = useNotifications();

  return <div className="fixed z-50 top-8 right-8 flex flex-col gap-2"></div>;
};
