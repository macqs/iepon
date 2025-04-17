
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("downloadKoreanPdfBtn");
  if (!btn) return;

  btn.addEventListener("click", () => {
    const jsPDF = window.jspdf.jsPDF;
    const doc = new jsPDF();

    doc.text("✅ PDF 출력 성공 - 기본 폰트 사용", 10, 20);
    doc.text("안녕하세요. 이 문장은 jsPDF 기본 폰트입니다.", 10, 30);
    doc.save("iepon_basic_font_test.pdf");
  });
});
