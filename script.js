
document.addEventListener("DOMContentLoaded", () => {
  const btn = document.getElementById("download");
  const target = document.getElementById("capture-area");

  btn.addEventListener("click", () => {
    html2pdf().set({
      margin: 10,
      filename: 'iepon_html2pdf_output.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    }).from(target).save();
  });
});
