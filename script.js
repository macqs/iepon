
// 학생 저장 및 선택 기능
const studentSelect = document.getElementById('studentSelect');
const newStudentInput = document.getElementById('newStudentName');
const addStudentBtn = document.getElementById('addStudentBtn');

function loadStudents() {
  const students = JSON.parse(localStorage.getItem('students') || '[]');
  studentSelect.innerHTML = '<option value="">학생 선택</option>';
  students.forEach(name => {
    const option = document.createElement('option');
    option.value = name;
    option.textContent = name;
    studentSelect.appendChild(option);
  });
}

addStudentBtn.addEventListener('click', () => {
  const name = newStudentInput.value.trim();
  if (name) {
    let students = JSON.parse(localStorage.getItem('students') || '[]');
    if (!students.includes(name)) {
      students.push(name);
      localStorage.setItem('students', JSON.stringify(students));
      loadStudents();
      newStudentInput.value = '';
    }
  }
});

window.addEventListener('DOMContentLoaded', loadStudents);

// 데이터 자동 불러오기 기능
function loadIEPData() {
  const student = studentSelect.value;
  const semester = document.getElementById('semesterSelect').value;
  const month = document.getElementById('monthSelect').value;

  if (student && semester && month) {
    const key = `${student}_${semester}_${month}`;
    const data = JSON.parse(localStorage.getItem(key));
    if (data) {
      document.getElementById('currentLevel').value = data.currentLevel || '';
      document.getElementById('semesterGoal').value = data.semesterGoal || '';
      document.getElementById('semesterEval').value = data.semesterEval || '';
      document.getElementById('monthGoal').value = data.monthGoal || '';
      document.getElementById('monthContent').value = data.monthContent || '';
      document.getElementById('monthMethod').value = data.monthMethod || '';
      document.getElementById('monthCriteria').value = data.monthCriteria || '';
      document.getElementById('monthEval').value = data.monthEval || '';
      document.getElementById('status').innerText = '데이터가 불러와졌습니다!';
      document.getElementById('reinforcePoint').value = data.reinforcePoint || 0;
      renderReinforceChart();
      document.getElementById('specialNote').value = data.specialNote || '';
    } else {
      document.getElementById('iepForm').reset();
      document.getElementById('status').innerText = '저장된 데이터가 없습니다.';
    }
  }
}

// 드롭다운 값이 바뀔 때마다 데이터 불러오기
studentSelect.addEventListener('change', loadIEPData);
document.getElementById('semesterSelect').addEventListener('change', loadIEPData);
document.getElementById('monthSelect').addEventListener('change', loadIEPData);

// IEP 저장
document.getElementById('iepForm').addEventListener('submit', function (e) {
  e.preventDefault();

  const student = studentSelect.value;
  const semester = document.getElementById('semesterSelect').value;
  const month = document.getElementById('monthSelect').value;

  const data = {
    currentLevel: document.getElementById('currentLevel').value,
    semesterGoal: document.getElementById('semesterGoal').value,
    semesterEval: document.getElementById('semesterEval').value,
    monthGoal: document.getElementById('monthGoal').value,
    monthContent: document.getElementById('monthContent').value,
    monthMethod: document.getElementById('monthMethod').value,
    monthCriteria: document.getElementById('monthCriteria').value,
    monthEval: document.getElementById('monthEval').value,
    reinforcePoint: document.getElementById('reinforcePoint').value,
    specialNote: document.getElementById('specialNote').value,
    reinforcePoint: document.getElementById('reinforcePoint').value
  };

  const key = `${student}_${semester}_${month}`;
  localStorage.setItem(key, JSON.stringify(data));

  document.getElementById('status').innerText = '저장되었습니다!';
});

// PDF 다운로드
function downloadPDF() {
  const student = studentSelect.value || '학생';
  const semester = document.getElementById('semesterSelect').value;
  const month = document.getElementById('monthSelect').value;

  const doc = new jspdf.jsPDF();

  doc.setFontSize(14);
  doc.text(`📘 IEPON - 개별화교육계획`, 10, 20);
  doc.text(`학생: ${student}`, 10, 30);
  doc.text(`학기: ${semester}`, 10, 40);
  doc.text(`월: ${month}`, 10, 50);

  let y = 60;
  const fields = [
    ["현행수준", 'currentLevel'],
    ["학기 목표", 'semesterGoal'],
    ["학기 평가", 'semesterEval'],
    ["교육 목표", 'monthGoal'],
    ["교육 내용", 'monthContent'],
    ["교육 방법", 'monthMethod'],
    ["평가 준거", 'monthCriteria'],
    ["교육 평가", 'monthEval']
  ];

  fields.forEach(([label, id]) => {
    const value = document.getElementById(id).value;
    doc.text(`${label}:`, 10, y);
    doc.setFontSize(11);
    doc.text(doc.splitTextToSize(value, 180), 10, y + 7);
    y += 7 + (value.length / 80) * 10 + 5;
    doc.setFontSize(14);
  });

  
  y += 10;
  const note = document.getElementById('specialNote').value;
  if (note) {
    doc.setFontSize(14);
    doc.text("특이사항 / 상담 메모:", 10, y);
    doc.setFontSize(11);
    doc.text(doc.splitTextToSize(note, 180), 10, y + 7);
  }
  doc.save(`IEPON_${student}_${semester}_${month}.pdf`);
    
}

document.getElementById('downloadPdfBtn').addEventListener('click', downloadPDF);

let reinforceChart;

function renderReinforceChart() {
  const student = document.getElementById('studentSelect').value;
  if (!student) return;

  const students = JSON.parse(localStorage.getItem('students') || '[]');
  if (!students.includes(student)) return;

  const months = ["3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월", "1월", "2월"];
  const dataPoints = months.map(month => {
    const semester = document.getElementById('semesterSelect').value;
    const key = `${student}_${semester}_${month}`;
    const data = JSON.parse(localStorage.getItem(key));
    return data ? Number(data.reinforcePoint || 0) : 0;
  });

  const ctx = document.getElementById('reinforceChart').getContext('2d');
  if (reinforceChart) reinforceChart.destroy();
  reinforceChart = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: months,
      datasets: [{
        label: '월별 강화포인트',
        data: dataPoints,
        backgroundColor: 'rgba(75, 192, 192, 0.6)'
      }]
    },
    options: {
      responsive: true,
      scales: {
        y: {
          beginAtZero: true,
          stepSize: 10
        }
      }
    }
  });
}

// 월 목표 자동 제안 기능
document.getElementById('monthSelect').addEventListener('change', () => {
  const monthGoal = document.getElementById('monthGoal');
  const semesterGoal = document.getElementById('semesterGoal').value;
  if (!monthGoal.value && semesterGoal) {
    monthGoal.value = semesterGoal + " (에서 파생된 월 목표)";
  }
});

function renderTimeline() {
  const student = document.getElementById('studentSelect').value;
  const semester = document.getElementById('semesterSelect').value;
  const timelineList = document.getElementById('timelineList');
  timelineList.innerHTML = '';

  if (!student || !semester) return;

  const months = ["3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월", "1월", "2월"];

  months.forEach(month => {
    const key = `${student}_${semester}_${month}`;
    const data = JSON.parse(localStorage.getItem(key));
    if (data && data.monthGoal) {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${month}:</strong> ${data.monthGoal}`;
      timelineList.appendChild(li);
    }
  });
}

document.getElementById('studentSelect').addEventListener('change', renderTimeline);
document.getElementById('semesterSelect').addEventListener('change', renderTimeline);

// CSV 다운로드 기능
document.getElementById('downloadCsvBtn').addEventListener('click', () => {
  const student = document.getElementById('studentSelect').value;
  const semester = document.getElementById('semesterSelect').value;
  if (!student || !semester) {
    alert("학생과 학기를 선택해주세요.");
    return;
  }

  const months = ["3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월", "1월", "2월"];
  let csv = "월,현행수준,학기목표,학기평가,월목표,교육내용,교육방법,평가준거,월평가,강화포인트,특이사항\n";

  months.forEach(month => {
    const key = `${student}_${semester}_${month}`;
    const data = JSON.parse(localStorage.getItem(key));
    if (data) {
      csv += [
        month,
        `"${data.currentLevel || ''}"`,
        `"${data.semesterGoal || ''}"`,
        `"${data.semesterEval || ''}"`,
        `"${data.monthGoal || ''}"`,
        `"${data.monthContent || ''}"`,
        `"${data.monthMethod || ''}"`,
        `"${data.monthCriteria || ''}"`,
        `"${data.monthEval || ''}"`,
        data.reinforcePoint || 0,
        `"${data.specialNote || ''}"`
      ].join(",") + "\n";
    }
  });

  const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = `IEPON_${student}_${semester}_전체기록.csv`;
  link.click();
});

// 학기 요약 PDF 생성
document.getElementById('downloadSummaryPdfBtn').addEventListener('click', () => {
  const student = document.getElementById('studentSelect').value;
  const semester = document.getElementById('semesterSelect').value;
  if (!student || !semester) {
    alert("학생과 학기를 선택해주세요.");
    return;
  }

  const months = ["3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월", "1월", "2월"];
  const doc = new jspdf.jsPDF();
  let y = 20;

  doc.setFontSize(16);
  doc.text(`📘 IEPON - ${student} / ${semester} 요약 리포트`, 10, y);
  y += 10;
  doc.setFontSize(12);

  months.forEach(month => {
    const key = `${student}_${semester}_${month}`;
    const data = JSON.parse(localStorage.getItem(key));
    if (data) {
      doc.setFont(undefined, "bold");
      doc.text(`${month}`, 10, y);
      y += 6;
      doc.setFont(undefined, "normal");

      const fields = [
        ["월 목표", data.monthGoal],
        ["교육 내용", data.monthContent],
        ["교육 방법", data.monthMethod],
        ["월 평가", data.monthEval],
        ["강화 포인트", data.reinforcePoint],
        ["특이사항", data.specialNote]
      ];

      fields.forEach(([label, value]) => {
        if (value) {
          const lines = doc.splitTextToSize(`${label}: ${value}`, 180);
          doc.text(lines, 10, y);
          y += lines.length * 6;
        }
      });

      y += 6;
      if (y > 270) {
        doc.addPage();
        y = 20;
      }
    }
  });

  doc.save(`IEPON_${student}_${semester}_요약리포트.pdf`);
});

// 탭 전환 기능
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-section').forEach(s => s.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.tab).classList.add('active');
  });
});
