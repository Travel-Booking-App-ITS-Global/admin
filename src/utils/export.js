/**
 * Utility to export data to CSV and trigger download in the browser.
 * @param {Array<Object>} data The array of objects to export
 * @param {string} filename The name of the file to save as
 */
export function exportToCSV(data, filename = "export.csv") {
  if (!data || !data.length) return;

  // Extract headers (keys of first object)
  const headers = Object.keys(data[0]);

  // Map to CSV rows
  const csvRows = [
    headers.join(","), // header row
    ...data.map((row) =>
      headers
        .map((fieldName) => {
          let val = row[fieldName];
          if (val === undefined || val === null) {
            val = "";
          } else if (Array.isArray(val)) {
            // Join array values (like tags) with semi-colons
            val = `"${val.join("; ").replace(/"/g, '""')}"`;
          } else if (typeof val === "object") {
            // Format object as JSON string
            val = `"${JSON.stringify(val).replace(/"/g, '""')}"`;
          } else {
            // Convert to string and escape quotes
            val = `"${String(val).replace(/"/g, '""')}"`;
          }
          return val;
        })
        .join(",")
    ),
  ];

  // Create Blob and trigger download
  const csvContent = "\uFEFF" + csvRows.join("\n"); // UTF-8 BOM for Excel support
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
}
