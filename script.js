
document.addEventListener("DOMContentLoaded", () => {
  // 탭 전환
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-section').forEach(s => s.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(btn.dataset.tab).classList.add('active');
    });
  });

  // PDF 다운로드 버튼
  const btn = document.getElementById("downloadPdfBtn");
  if (btn) {
    btn.addEventListener("click", () => {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      doc.text("📄 IEPON PDF 작동 확인 완료!", 10, 20);
      doc.save("iepon_output.pdf");
    });
  }
});
