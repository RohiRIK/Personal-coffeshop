import { Order } from "lib/firebase/types";

export function convertOrdersToCSV(orders: Order[]): string {
  // Define columns
  const columns = [
    "Order ID",
    "Date",
    "Time",
    "Customer",
    "Email",
    "Total",
    "Status",
    "Items",
  ];

  // Create header row
  const header = columns.join(",");

  // Create rows
  const rows = orders.map((order) => {
    const date = new Date(order.createdAt);
    const dateStr = date.toLocaleDateString();
    const timeStr = date.toLocaleTimeString();

    // Escape fields that might contain commas
    const escape = (field: string | number | null | undefined) => {
      if (field === null || field === undefined) return "";
      const stringified = String(field);
      if (
        stringified.includes(",") ||
        stringified.includes('"') ||
        stringified.includes("\n")
      ) {
        return `"${stringified.replace(/"/g, '""')}"`;
      }
      return stringified;
    };

    const itemsSummary = order.items
      .map(
        (item) => `${item.quantity}x ${item.name} (${item.milk || "Standard"})`,
      )
      .join("; ");

    return [
      escape(order.id),
      escape(dateStr),
      escape(timeStr),
      escape(order.userName),
      escape(order.userEmail),
      escape(order.total.toFixed(2)),
      escape(order.status),
      escape(itemsSummary),
    ].join(",");
  });

  return [header, ...rows].join("\n");
}

export function downloadCSV(content: string, filename: string) {
  const blob = new Blob([content], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  if (link.download !== undefined) {
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", filename);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}
