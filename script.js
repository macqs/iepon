
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc, collection, getDocs } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

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

// 학생 추가
document.getElementById('addStudentBtn').addEventListener('click', async () => {
  const name = document.getElementById('newStudentName').value.trim();
  if (name) {
    await setDoc(doc(db, "students", name), { name: name });
    loadStudents();
    document.getElementById('newStudentName').value = '';
  }
});

// 학생 목록 불러오기
async function loadStudents() {
  const studentSelect = document.getElementById('studentSelect');
  studentSelect.innerHTML = '<option value="">학생 선택</option>';
  const querySnapshot = await getDocs(collection(db, "students"));
  querySnapshot.forEach((doc) => {
    const name = doc.data().name;
    const option = document.createElement('option');
    option.value = name;
    option.textContent = name;
    studentSelect.appendChild(option);
  });
}

// 저장
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

// 불러오기
async function loadIEP() {
  const student = document.getElementById('studentSelect').value;
  const semester = document.getElementById('semesterSelect').value;
  const month = document.getElementById('monthSelect').value;
  if (!student || !semester || !month) return;

  const key = `${student}_${semester}_${month}`;
  const docRef = doc(db, "iep_records", key);
  const docSnap = await getDoc(docRef);

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

// 타임라인 렌더링
async function renderTimeline() {
  const student = document.getElementById('studentSelect').value;
  const semester = document.getElementById('semesterSelect').value;
  const timelineList = document.getElementById('timelineList');
  timelineList.innerHTML = '';

  if (!student || !semester) return;
  const months = ["3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월", "1월", "2월"];

  for (const month of months) {
    const key = `${student}_${semester}_${month}`;
    const docSnap = await getDoc(doc(db, "iep_records", key));
    if (docSnap.exists()) {
      const data = docSnap.data();
      if (data.monthGoal) {
        const li = document.createElement('li');
        li.innerHTML = `<strong>${month}:</strong> ${data.monthGoal}`;
        timelineList.appendChild(li);
      }
    }
  }
}

// 탭 전환 기능
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.tab-section').forEach(s => s.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById(btn.dataset.tab).classList.add('active');
  });
});

// 초기 실행
window.addEventListener('DOMContentLoaded', () => {
  loadStudents();
});
