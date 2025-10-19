"use client";

import { User } from "@/types/user";
import { useMemo } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

interface UserGraphProps {
  users: User[];
}

export function UserGraph({ users }: UserGraphProps) {
  const chartData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      date.setHours(0, 0, 0, 0);
      return date;
    });

    return last7Days.map((date) => {
      const nextDay = new Date(date);
      nextDay.setDate(nextDay.getDate() + 1);

      const count = users.filter((user) => {
        const userDate = new Date(user.createdAt);
        return userDate >= date && userDate < nextDay;
      }).length;

      return {
        date: date.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
        }),
        count,
      };
    });
  }, [users]);

  return (
    <div className="border border-gray-200 p-4">
      <h2 className="text-lg font-semibold mb-4">
        Users Created (Last 7 Days)
      </h2>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="date" tick={{ fontSize: 12 }} stroke="#6b7280" />
          <YAxis
            tick={{ fontSize: 12 }}
            stroke="#6b7280"
            allowDecimals={false}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #e5e7eb",
              borderRadius: "4px",
            }}
          />
          <Bar dataKey="count" fill="#3b82f6" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
