
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("downloadKoreanPdfBtn");
  if (btn) {
    btn.addEventListener("click", () => {
      const doc = new window.jspdf.jsPDF();
      console.log("📋 등록된 폰트 목록:", doc.getFontList());

      doc.setFont("ChosunGu", "normal");
      doc.text("✅ 성공! 내장 폰트로 한글 출력 OK", 10, 20);
      doc.save("iepon_korean_final.pdf");
    });
  }
});
