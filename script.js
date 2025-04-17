
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("downloadKoreanPdfBtn");
  if (btn) {
    btn.addEventListener("click", () => {
      const doc = new window.jspdf.jsPDF();
      console.log("📋 등록된 폰트 목록:", doc.getFontList()); // 디버깅용
      doc.setFont("ChosunGu", "normal");
      doc.text("✅ 한글 PDF 출력 성공 (ChosunGu)", 10, 20);
      doc.save("iepon_final_korean.pdf");
    });
  }
});
