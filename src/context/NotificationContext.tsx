import instance from "@/config/axios.config";
import parseAttributes from "@/utils/parse-data";
import { createContext, useContext, useEffect, useRef, useState } from "react";
import AuthContext from "./AuthContext";

export type NotificationData = {
  title: string;
  body: string;
  timestamp: string;
  viewed: boolean;
};

export type JobNotificationData = {
  jobId: string;
} & NotificationData;

export type NotificationId = ReturnType<typeof setTimeout>;

export const NotificationContext = createContext<{
  activeNotifications: NotificationData[];
  scheduleNotification: (
    jobId: string,
    notification: NotificationData,
    onClear: () => void
  ) => NotificationId;
  replaceNotification: (jobId: string, notification: NotificationData) => void;
  deleteNotification: (jobId: string) => void;
  getAllNotifications: () => JobNotificationData[];
  checkOverdue: (jobId: string) => boolean;
  refreshNotificationData: (data: JobType[]) => void;
  markViewed: (jobId: string) => Promise<void>;
}>({
  activeNotifications: [],
  scheduleNotification: (id, notification) => {
    const n = new Notification(notification.title, {
      body: notification.body,
      timestamp: new Date(notification.timestamp).getTime(),
    });
    return setTimeout(() => {}, 0);
  },
  replaceNotification: () => {},
  deleteNotification: () => {},
  getAllNotifications: () => [],
  checkOverdue: () => false,
  refreshNotificationData: () => {},
  markViewed: () => Promise.resolve(),
});

export const NotificationProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { user } = useContext(AuthContext);

  const [timers, setTimers] = useState<
    { id: NotificationId; data: NotificationData; jobId: string }[]
  >([]);

  const allNotifications = useRef<JobNotificationData[]>([]);

  const triggerNotification = (
    notification: NotificationData,
    onClear: () => void = () => {}
  ) => {
    const n = new Notification(notification.title, {
      body: notification.body,
      timestamp: new Date(notification.timestamp).getTime(),
    });

    n.onclick = () => {
      onClear();
    };

    n.onclose = () => {
      onClear();
    };
  };

  const bulkSchedule = (data: JobType[]) => {
    // Schedule notifications for each job
    data.forEach((job) => {
      if (job?.notification && job?.notification.viewed === false) {
        scheduleNotification(
          job.id.toString(),
          {
            title: job.notification.title,
            body: job.notification.body,
            timestamp: job.notification.timestamp,
            viewed: job.notification.viewed,
          },
          () => {
            console.log("CLOSED");
            // Update the notification to viewed
            markViewed(job.id.toString()).then((res) => console.log({ res }));
          }
        );
      }
    });
  };

  // Ask for permission to use notifications
  useEffect(() => {
    if (!user) {
      console.warn("No user, aborting notification setup");
      resetTimers();
      return;
    }

    Notification.requestPermission();

    // Fetch the data too
    instance.get("/jobs?populate=*").then((res) => {
      const data = parseAttributes(res.data.data) as JobType[];
      refreshNotificationData(data);
    });
  }, [user]);

  const scheduleNotification = (
    jobId: string,
    notification: NotificationData,
    onClear: () => void = () => {}
  ) => {
    const id = setTimeout(() => {
      triggerNotification(notification, onClear);
      setTimers(timers.filter((timer) => timer.id !== id));
    }, new Date(notification.timestamp).getTime() - Date.now());

    setTimers([...timers, { id, data: notification, jobId }]);

    return id;
  };

  const replaceNotification = (
    jobId: string,
    notification: NotificationData
  ) => {
    setTimers((timers) => timers.filter((timer) => timer.jobId !== jobId));
    allNotifications.current = allNotifications.current.filter(
      (n) => n.jobId !== jobId
    );

    allNotifications.current.push({
      jobId,
      ...notification,
    });

    return scheduleNotification(jobId, notification, () => {
      console.log("CLOSED");
      // Update the notification to viewed
      markViewed(jobId).then((res) => console.log({ res }));
    });
  };

  const deleteNotification = (jobId: string) => {
    const timer = timers.find((timer) => timer.jobId === jobId);
    clearInterval(timer?.id);
    setTimers(timers.filter((timer) => timer.jobId !== jobId));
  };

  const markViewed = async (jobId: string) => {
    const notif = allNotifications.current.find((n) => n.jobId === jobId);
    await instance.put(`/jobs/${jobId}`, {
      data: {
        notification: {
          ...notif,
          viewed: true,
        },
      },
    });
    // Update the notification to viewed
    allNotifications.current = allNotifications.current.map((n) => {
      if (n.jobId === jobId) {
        return {
          ...n,
          viewed: true,
        };
      }
      return n;
    });
    // Update the timer
    setTimers((timers) => timers.filter((timer) => timer.jobId !== jobId));
  };

  const getAllNotifications = () => {
    return allNotifications.current;
  };

  const resetTimers = () => {
    timers.forEach((timer) => {
      clearInterval(timer.id);
    });
    setTimers([]);
  };

  const refreshNotificationData = (data: JobType[]) => {
    allNotifications.current = data
      .filter((job) => !!job.notification)
      .map((job) => ({
        jobId: job.id.toString(),
        ...(job.notification as NonNullable<JobType["notification"]>),
      }));

    bulkSchedule(data);
  };

  const checkOverdue = (jobId: string) => {
    const job = allNotifications.current.find((n) => n.jobId === jobId);
    if (!job) return false;

    return new Date(job.timestamp) < new Date() && !job.viewed;
  };

  if (!user) return <>{children}</>;

  return (
    <NotificationContext.Provider
      value={{
        activeNotifications: timers.map((timer) => timer.data),
        scheduleNotification,
        replaceNotification,
        deleteNotification,
        getAllNotifications,
        refreshNotificationData,
        checkOverdue,
        markViewed,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};
