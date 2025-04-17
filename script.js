
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";
import * as jsPDF from "https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js";

const firebaseConfig = {
  apiKey: "AIzaSyDVJdHEkFv82iH96ReHKSiKirFHzkEMmY4",
  authDomain: "iepon-85a4f.firebaseapp.com",
  projectId: "iepon-85a4f",
  storageBucket: "iepon-85a4f.firebasestorage.app",
  messagingSenderId: "925307405718",
  appId: "1:925307405718:web:00d9dee6929c200ee849b7",
  measurementId: "G-ENTY6EN352"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

window.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-section').forEach(s => s.classList.remove('active'));
      btn.classList.add('active');
      document.getElementById(btn.dataset.tab).classList.add('active');
    });
  });

  loadStudents();

  document.getElementById('addStudentBtn').addEventListener('click', async () => {
    const name = document.getElementById('newStudentName').value.trim();
    if (name) {
      await setDoc(doc(db, "students", name), { name: name });
      loadStudents();
      document.getElementById('newStudentName').value = '';
    }
  });

  document.getElementById('iepForm').addEventListener('submit', async function (e) {
    e.preventDefault();
    const student = document.getElementById('studentSelect').value;
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
      specialNote: document.getElementById('specialNote').value
    };

    const key = `${student}_${semester}_${month}`;
    await setDoc(doc(db, "iep_records", key), data);
    document.getElementById('status').innerText = '✅ Firebase에 저장되었습니다!';
    renderTimeline();
  });

  document.getElementById('studentSelect').addEventListener('change', loadIEP);
  document.getElementById('semesterSelect').addEventListener('change', loadIEP);
  document.getElementById('monthSelect').addEventListener('change', () => {
    const monthGoal = document.getElementById('monthGoal');
    const semesterGoal = document.getElementById('semesterGoal').value;
    if (!monthGoal.value && semesterGoal) {
      monthGoal.value = semesterGoal + " (에서 파생된 월 목표)";
    }
    loadIEP();
  });

  document.getElementById('downloadPdfBtn').addEventListener('click', async () => {
    const student = document.getElementById('studentSelect').value;
    const semester = document.getElementById('semesterSelect').value;
    const month = document.getElementById('monthSelect').value;
    const key = `${student}_${semester}_${month}`;
    const snap = await getDoc(doc(db, "iep_records", key));
    if (!snap.exists()) return;
    const data = snap.data();
    const docu = new jsPDF.jsPDF();
    let y = 20;
    docu.setFontSize(16);
    docu.text(`📘 ${student} - ${semester} ${month}`, 10, y);
    y += 10;
    for (const [label, id] of [
      ['현행수준', 'currentLevel'], ['학기 목표', 'semesterGoal'], ['학기 평가', 'semesterEval'],
      ['월 목표', 'monthGoal'], ['교육 내용', 'monthContent'], ['교육 방법', 'monthMethod'],
      ['평가 준거', 'monthCriteria'], ['월 평가', 'monthEval'], ['특이사항', 'specialNote']
    ]) {
      if (data[id]) {
        docu.setFontSize(12);
        docu.text(`${label}:`, 10, y);
        y += 6;
        docu.text(docu.splitTextToSize(data[id], 180), 10, y);
        y += 10;
      }
    }
    docu.save(`IEPON_${student}_${semester}_${month}.pdf`);
  });

  document.getElementById('downloadCsvBtn').addEventListener('click', async () => {
    const student = document.getElementById('studentSelect').value;
    const semester = document.getElementById('semesterSelect').value;
    const months = ["3월","4월","5월","6월","7월","8월","9월","10월","11월","12월","1월","2월"];
    let csv = "월,현행수준,학기목표,학기평가,월목표,교육내용,교육방법,평가준거,월평가,강화포인트,특이사항\n";
    for (const month of months) {
      const key = `${student}_${semester}_${month}`;
      const snap = await getDoc(doc(db, "iep_records", key));
      if (snap.exists()) {
        const d = snap.data();
        csv += [
          month, d.currentLevel || '', d.semesterGoal || '', d.semesterEval || '',
          d.monthGoal || '', d.monthContent || '', d.monthMethod || '',
          d.monthCriteria || '', d.monthEval || '', d.reinforcePoint || 0, d.specialNote || ''
        ].map(x => `"${x}"`).join(",") + "\n";
      }
    }
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `IEPON_${student}_${semester}_전체기록.csv`;
    link.click();
  });

  document.getElementById('downloadSummaryPdfBtn').addEventListener('click', async () => {
    const student = document.getElementById('studentSelect').value;
    const semester = document.getElementById('semesterSelect').value;
    const months = ["3월","4월","5월","6월","7월","8월","9월","10월","11월","12월","1월","2월"];
    const docu = new jsPDF.jsPDF();
    let y = 20;
    docu.setFontSize(16);
    docu.text(`${student} - ${semester} 학기 요약 리포트`, 10, y);
    y += 10;
    for (const month of months) {
      const key = `${student}_${semester}_${month}`;
      const snap = await getDoc(doc(db, "iep_records", key));
      if (snap.exists()) {
        const d = snap.data();
        docu.setFontSize(13);
        docu.text(`${month}`, 10, y);
        y += 6;
        const fields = [["월목표", d.monthGoal], ["교육평가", d.monthEval], ["강화포인트", d.reinforcePoint], ["특이사항", d.specialNote]];
        for (const [label, value] of fields) {
          if (value) {
            docu.setFontSize(11);
            const text = docu.splitTextToSize(`${label}: ${value}`, 180);
            docu.text(text, 10, y);
            y += text.length * 6 + 2;
          }
        }
        y += 4;
        if (y > 270) {
          docu.addPage();
          y = 20;
        }
      }
    }
    docu.save(`IEPON_${student}_${semester}_요약.pdf`);
  });
});

async function loadStudents() {
  const studentSelect = document.getElementById('studentSelect');
  studentSelect.innerHTML = '<option value="">학생 선택</option>';
  const querySnapshot = await getDocs(collection(getFirestore(), "students"));
  querySnapshot.forEach((doc) => {
    const name = doc.data().name;
    const option = document.createElement('option');
    option.value = name;
    option.textContent = name;
    studentSelect.appendChild(option);
  });
}

async function loadIEP() {
  const student = document.getElementById('studentSelect').value;
  const semester = document.getElementById('semesterSelect').value;
  const month = document.getElementById('monthSelect').value;
  if (!student || !semester || !month) return;
  const key = `${student}_${semester}_${month}`;
  const docSnap = await getDoc(doc(getFirestore(), "iep_records", key));
  if (docSnap.exists()) {
    const data = docSnap.data();
    document.getElementById('currentLevel').value = data.currentLevel || '';
    document.getElementById('semesterGoal').value = data.semesterGoal || '';
    document.getElementById('semesterEval').value = data.semesterEval || '';
    document.getElementById('monthGoal').value = data.monthGoal || '';
    document.getElementById('monthContent').value = data.monthContent || '';
    document.getElementById('monthMethod').value = data.monthMethod || '';
    document.getElementById('monthCriteria').value = data.monthCriteria || '';
    document.getElementById('monthEval').value = data.monthEval || '';
    document.getElementById('reinforcePoint').value = data.reinforcePoint || 0;
    document.getElementById('specialNote').value = data.specialNote || '';
    document.getElementById('status').innerText = '📥 Firebase로부터 데이터 불러오기 완료!';
  } else {
    document.getElementById('iepForm').reset();
    document.getElementById('status').innerText = '❌ Firebase에 저장된 데이터가 없습니다.';
  }
  renderTimeline();
}

async function renderTimeline() {
  const student = document.getElementById('studentSelect').value;
  const semester = document.getElementById('semesterSelect').value;
  const timelineList = document.getElementById('timelineList');
  timelineList.innerHTML = '';
  if (!student || !semester) return;
  const months = ["3월","4월","5월","6월","7월","8월","9월","10월","11월","12월","1월","2월"];
  for (const month of months) {
    const key = `${student}_${semester}_${month}`;
    const snap = await getDoc(doc(getFirestore(), "iep_records", key));
    if (snap.exists()) {
      const d = snap.data();
      if (d.monthGoal) {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${month}:</strong> ${d.monthGoal}`;
        timelineList.appendChild(li);
      }
    }
  }
}
