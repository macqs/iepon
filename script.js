
const firebaseConfig = {
  apiKey: "AIzaSyDVJdHEkFv82iH96ReHKSiKirFHzkEMmY4",
  authDomain: "iepon-85a4f.firebaseapp.com",
  projectId: "iepon-85a4f",
  storageBucket: "iepon-85a4f.appspot.com",
  messagingSenderId: "925307405718",
  appId: "1:925307405718:web:00d9dee6929c200ee849b7",
  measurementId: "G-ENTY6EN352"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();

document.addEventListener("DOMContentLoaded", () => {
  const $ = (id) => document.getElementById(id);

  const loadStudents = async () => {
    const select = $("studentSelect");
    select.innerHTML = '<option value="">선택</option>';
    const snap = await db.collection("students").get();
    snap.forEach(doc => {
      const opt = document.createElement("option");
      opt.value = opt.textContent = doc.id;
      select.appendChild(opt);
    });
  };

  $("addStudentBtn").addEventListener("click", async () => {
    const name = $("newStudentName").value.trim();
    if (name) {
      await db.collection("students").doc(name).set({ name });
      $("newStudentName").value = "";
      loadStudents();
    }
  });

  $("studentSelect").addEventListener("change", loadData);
  $("semesterSelect").addEventListener("change", loadData);
  $("monthSelect").addEventListener("change", loadData);

  async function loadData() {
    const s = $("studentSelect").value;
    const sem = $("semesterSelect").value;
    const m = $("monthSelect").value;
    if (!s || !sem || !m) return;
    const key = `${s}_${sem}_${m}`;
    const docSnap = await db.collection("iep_records").doc(key).get();
    if (docSnap.exists) {
      const d = docSnap.data();
      $("currentLevel").value = d.currentLevel || "";
      $("semesterGoal").value = d.semesterGoal || "";
      $("semesterEval").value = d.semesterEval || "";
      $("monthGoal").value = d.monthGoal || "";
      $("monthContent").value = d.monthContent || "";
      $("monthMethod").value = d.monthMethod || "";
      $("monthCriteria").value = d.monthCriteria || "";
      $("monthEval").value = d.monthEval || "";
      $("reinforcePoint").value = d.reinforcePoint || 0;
      $("specialNote").value = d.specialNote || "";
      $("status").innerText = "📥 불러오기 완료";
    } else {
      $("status").innerText = "ℹ️ 저장된 데이터 없음";
    }
  }

  $("saveBtn").addEventListener("click", async () => {
    const s = $("studentSelect").value;
    const sem = $("semesterSelect").value;
    const m = $("monthSelect").value;
    if (!s || !sem || !m) {
      $("status").innerText = "⚠️ 학생, 학기, 월 선택 필요";
      return;
    }

    const data = {
      currentLevel: $("currentLevel").value,
      semesterGoal: $("semesterGoal").value,
      semesterEval: $("semesterEval").value,
      monthGoal: $("monthGoal").value,
      monthContent: $("monthContent").value,
      monthMethod: $("monthMethod").value,
      monthCriteria: $("monthCriteria").value,
      monthEval: $("monthEval").value,
      reinforcePoint: $("reinforcePoint").value,
      specialNote: $("specialNote").value
    };

    const key = `${s}_${sem}_${m}`;
    await db.collection("iep_records").doc(key).set(data);
    $("status").innerText = "✅ 저장 완료";
  });

  $("download").addEventListener("click", () => {
    const element = document.getElementById("capture-area");
    html2pdf().set({
      margin: 10,
      filename: 'IEPON_기록.pdf',
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    }).from(element).save();
  });

  loadStudents();
});

// 팝업 안내 닫기 기능
window.addEventListener('DOMContentLoaded', () => {
  const popup = document.getElementById('popupOverlay');
  const closeBtn = document.getElementById('closePopupBtn');
  closeBtn.addEventListener('click', () => popup.style.display = 'none');
});
