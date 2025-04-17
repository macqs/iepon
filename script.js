
document.getElementById('iepForm').addEventListener('submit', function (e) {
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
    monthEval: document.getElementById('monthEval').value
  };

  const key = `${student}_${semester}_${month}`;
  localStorage.setItem(key, JSON.stringify(data));

  document.getElementById('status').innerText = '저장되었습니다!';
});
