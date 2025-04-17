
document.addEventListener("DOMContentLoaded", () => {
  // 탭 전환 예시
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-section').forEach(s => s.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(btn.dataset.tab).classList.add('active');
    });
  });

  // PDF 다운로드
  const pdfBtn = document.getElementById("downloadPdfBtn");
  if (pdfBtn) {
    pdfBtn.addEventListener("click", () => {
      const { jsPDF } = window.jspdf;
      const doc = new jsPDF();
      doc.text("🎉 PDF 다운로드가 작동합니다!", 10, 20);
      doc.save("iepon_test.pdf");
    });
  }

  // 학생 드롭다운 초기화
  const studentSelect = document.getElementById("studentSelect");
  if (studentSelect) {
    studentSelect.innerHTML = '<option>테스트 학생</option>';
  }
});
