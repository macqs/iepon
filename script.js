
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("downloadKoreanPdfBtn");
  if (btn) {
    btn.addEventListener("click", () => {
      const doc = new window.jspdf.default.jsPDF();
      console.log("📋 등록된 폰트 목록:", doc.getFontList());

      doc.setFont("ChosunGu", "normal");
      doc.text("✅ 드디어 성공! 한글 출력 OK!", 10, 20);
      doc.save("iepon_final_korean.pdf");
    });
  }
});
