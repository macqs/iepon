
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("downloadKoreanPdfBtn");
  if (btn) {
    btn.addEventListener("click", () => {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      doc.setFont("ChosunGu", "normal");
      doc.text("안녕하세요! IEPON 시스템 PDF입니다. 한글 출력 성공 ✅", 10, 20);
      doc.save("iepon_korean_output.pdf");
    });
  }
});
