import React from "react";

export function Home({ lang }) {
  return (
    <div>
      {lang === "th" ? (
        <>
          <h1>ยินดีต้อนรับสู่ GENESIS Portal</h1>
          <p>
            Phase 1.1 – ระบบพนักงาน (Employee Core Module) อยู่ระหว่างเริ่มต้นพัฒนา
            เมนูด้านบนสามารถสลับภาษา TH/EN ได้ และหน้า "พนักงาน" จะเป็นหน้าหลักของเฟสนี้
          </p>
        </>
      ) : (
        <>
          <h1>Welcome to GENESIS Portal</h1>
          <p>
            Phase 1.1 – Employee Core Module is being initialized. Use the menu above
            to switch language TH/EN. The "Employees" page will be the main focus for this phase.
          </p>
        </>
      )}
    </div>
  );
}
