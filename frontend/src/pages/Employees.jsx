import React, { useEffect, useState } from "react";

const TEXT = {
  th: {
    title: "รายการพนักงาน (ตัวอย่าง Phase 1.1)",
    name: "ชื่อ-นามสกุล",
    email: "อีเมล",
    position: "ตำแหน่ง",
    passport: "หนังสือเดินทาง",
    health: "ใบรับรองแพทย์",
    loading: "กำลังโหลดข้อมูล...",
    error: "ไม่สามารถโหลดข้อมูลพนักงานได้",
  },
  en: {
    title: "Employees (Phase 1.1 Example)",
    name: "Full name",
    email: "Email",
    position: "Position",
    passport: "Passport",
    health: "Health Certificate",
    loading: "Loading employees...",
    error: "Unable to load employee data",
  },
};

export function Employees({ lang }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const t = TEXT[lang];

  useEffect(() => {
    async function load() {
      try {
        // NOTE:
        // In the next phase we will point this to the real backend URL,
        // e.g. `/backend/api/employees/list.php`
        const resp = await fetch("/backend/api/employees/list.php");
        if (!resp.ok) {
          throw new Error("HTTP " + resp.status);
        }
        const data = await resp.json();
        setItems(data.items || []);
      } catch (err) {
        console.error(err);
        setError(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) {
    return <p>{t.loading}</p>;
  }

  if (error) {
    return (
      <div>
        <p>{t.error}</p>
        <pre style={{ color: "crimson" }}>{String(error)}</pre>
      </div>
    );
  }

  return (
    <div>
      <h1>{t.title}</h1>
      <table
        style={{
          borderCollapse: "collapse",
          minWidth: "70%",
          marginTop: "1rem",
        }}
      >
        <thead>
          <tr>
            <th style={thStyle}>{t.name}</th>
            <th style={thStyle}>{t.email}</th>
            <th style={thStyle}>{t.position}</th>
            <th style={thStyle}>{t.passport}</th>
            <th style={thStyle}>{t.health}</th>
          </tr>
        </thead>
        <tbody>
          {items.map((emp) => (
            <tr key={emp.id}>
              <td style={tdStyle}>{emp.fullname}</td>
              <td style={tdStyle}>{emp.email}</td>
              <td style={tdStyle}>{emp.position}</td>
              <td style={tdStyle}>{emp.passport_no}</td>
              <td style={tdStyle}>{emp.health_cert_expiry}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

const thStyle = {
  borderBottom: "1px solid #ccc",
  padding: "0.5rem 0.75rem",
  textAlign: "left",
  background: "#fafafa",
};

const tdStyle = {
  borderBottom: "1px solid #eee",
  padding: "0.4rem 0.75rem",
};
