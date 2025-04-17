
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-app.js";
import { getFirestore, doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/11.6.0/firebase-firestore.js";

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

// 저장 함수
export async function saveIEP(student, semester, month, data) {
  const key = `${student}_${semester}_${month}`;
  await setDoc(doc(db, "iep_records", key), data);
  document.getElementById('status').innerText = '✅ Firebase에 저장되었습니다!';
}

// 불러오기 함수
export async function loadIEP(student, semester, month) {
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
}
