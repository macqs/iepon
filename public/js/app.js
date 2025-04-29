// public/js/app.js

// 0) UUID 모듈 가져오기 (jspm 이용)
import { v4 as uuidv4 } from 'https://jspm.dev/uuid';

// 1) 전역 상태 관리 객체
export const state = {
    students: [],            // { id, name, … }
    currentStudentId: null,  // 탭1 저장 시 설정
    plans: {}                // { [studentId]: { [subject]: [planRows] } }
};

// 2) 탭 초기화 진입점
export function initTab(tabName) {
    switch (tabName) {
        case 'tab1':
            initTab1();
            break;
        case 'tab2':
            initTab2();
            break;
        // case 'tab3': initTab3(); break;
        // … tab4~tab6
        default:
            break;
    }
}

// ────────────────────────────────────────────────
// 3) 탭1 (“인적사항”) 로직
function initTab1() {
    const birthEl = document.getElementById('student-birth');
    const actualAgeEl = document.getElementById('student-age-actual');
    const koreanAgeEl = document.getElementById('student-age-korean');
    const deferralEl = document.getElementById('student-deferral');
    const relationSelect = document.getElementById('guardian-relation');
    const relationCustom = document.getElementById('guardian-relation-custom');
    const addressBtn = document.getElementById('address-search-btn');
    const assistantYes = document.getElementById('assistant-yes');
    const assistantNo = document.getElementById('assistant-no');
    const assistantType = document.getElementById('assistant-type');
    const welfareYes = document.getElementById('card-yes');
    const welfareNo = document.getElementById('card-no');
    const welfareTypeSelect = document.getElementById('disability-type-welfare');
    const welfareIssueDateEl = document.getElementById('welfare-issue-date');
    const contactEl = document.getElementById('guardian-contact');
    const dateInputs = document.querySelectorAll('input[type="date"]');
    const form = document.getElementById('form-tab1');
    const nameEl = document.getElementById('student-name');

    // (추가) currentStudentId 초기화 예시
    state.currentStudentId = nameEl.value || '학생1';  // 실제로는 탭1 저장 시 설정하세요

    // 1) 생년월일 변경 → 만 나이·세는 나이·유예기간 계산
    birthEl.addEventListener('change', () => {
        const birth = new Date(birthEl.value);
        const today = new Date();
        let age = today.getFullYear() - birth.getFullYear();
        const mDiff = today.getMonth() - birth.getMonth();
        if (mDiff < 0 || (mDiff === 0 && today.getDate() < birth.getDate())) age--;
        actualAgeEl.value = age;
        koreanAgeEl.value = today.getFullYear() - birth.getFullYear() + 1;
        deferralEl.value = Math.max(0, age - 7);
    });

    // 2) 보호자 관계 “직접입력” 토글
    relationSelect.addEventListener('change', () => {
        if (relationSelect.value === '직접입력') {
            relationCustom.classList.remove('d-none');
        } else {
            relationCustom.classList.add('d-none');
            relationCustom.value = '';
        }
    });

    // 3) 주소 검색 (카카오 우편번호 API)
    addressBtn.addEventListener('click', () => {
        setTimeout(() => {
            new daum.Postcode({
                oncomplete: data => {
                    document.getElementById('postcode').value = data.zonecode;
                    document.getElementById('address').value = data.address;
                    document.getElementById('address-detail').focus();
                }
            }).open();
        }, 0);
    });

    // 4) 보조인력 지원 토글
    function toggleAssistantType() {
        if (assistantYes.checked) {
            assistantType.classList.remove('d-none');
        } else {
            assistantType.classList.add('d-none');
            assistantType.value = '';
        }
    }
    assistantYes.addEventListener('change', toggleAssistantType);
    assistantNo.addEventListener('change', toggleAssistantType);
    toggleAssistantType();

    // 5) 복지카드 유/무 토글
    function toggleWelfareFields() {
        const enabled = welfareYes.checked;
        welfareTypeSelect.disabled = !enabled;
        welfareIssueDateEl.disabled = !enabled;
        if (!enabled) {
            welfareTypeSelect.value = '';
            welfareIssueDateEl.value = '';
        }
    }
    welfareYes.addEventListener('change', toggleWelfareFields);
    welfareNo.addEventListener('change', toggleWelfareFields);
    toggleWelfareFields();

    // 6) 연락처 자동 하이픈 및 길이 제한
    contactEl.addEventListener('input', () => {
        let d = contactEl.value.replace(/\D/g, '').slice(0, 11);
        if (d.startsWith('010')) {
            contactEl.value = d
                .replace(/^(010)(\d{4})(\d{0,4}).*/, '$1-$2-$3')
                .replace(/-$/, '');
        } else {
            contactEl.value = d;
        }
    });

    // 7) 날짜 자동 하이픈 포맷팅
    dateInputs.forEach(input => {
        input.addEventListener('input', () => {
            const v = input.value.replace(/\D/g, '').slice(0, 8);
            const y = v.slice(0, 4), m = v.slice(4, 6), d = v.slice(6, 8);
            input.value = [y, m, d].filter(Boolean).join('-');
        });
    });

    // 8) 폼 제출 핸들러 (state 저장 예시)
    form.addEventListener('submit', async e => {
        e.preventDefault();
        // state.students.push({ id: state.currentStudentId, name: nameEl.value, … });
        alert('탭1 데이터 저장 완료!');
    });
}

// ────────────────────────────────────────────────
// 4) 탭2 (“월별 목표”) 로직
function initTab2() {
    const studentNameInput = document.getElementById('tab2-student-name');
    const subjectSelect = document.getElementById('tab2-subject');
    const planRowsContainer = document.getElementById('plan-rows');
    const addBtn = document.getElementById('add-plan-btn');
    const saveBtn = document.getElementById('save-tab2-btn');

    // 탭1에서 설정된 학생명 표시 (실제 로직에 맞춰 연결하세요)
    studentNameInput.value = state.currentStudentId;

    // 계획 행 추가 함수
    function addPlanRow(data = {}) {
        const id = uuidv4();
        const card = document.createElement('div');
        card.className = 'card mb-3 p-3';
        card.dataset.id = id;
        card.innerHTML = `
      <div class="row g-2 align-items-end">
        <div class="col-md-2">
          <label class="form-label">월</label>
          <select class="form-select month-input">
            ${[...Array(12)].map((_, i) => `
              <option value="${i + 1}" ${data.month == i + 1 ? 'selected' : ''}>${i + 1}월</option>
            `).join('')}
          </select>
        </div>
        <div class="col-md-10 text-end">
          <button class="btn btn-sm btn-danger remove-plan-btn">삭제</button>
        </div>
        <div class="col-md-6">
          <label class="form-label">교육목표</label>
          <textarea class="form-control goal-input" rows="2">${data.goal || ''}</textarea>
        </div>
        <div class="col-md-6">
          <label class="form-label">교육내용</label>
          <textarea class="form-control content-input" rows="2">${data.content || ''}</textarea>
        </div>
        <div class="col-md-12">
          <label class="form-label">교육방법 (최대 5개)</label>
          <div class="d-flex flex-wrap methods-group">
            ${['관찰학습', '직접교수', '협동학습', '프로젝트', '놀이'].map(m => `
              <div class="form-check me-3">
                <input class="form-check-input method-checkbox" type="checkbox" value="${m}"
                  ${data.methods?.includes(m) ? 'checked' : ''}/>
                <label class="form-check-label">${m}</label>
              </div>
            `).join('')}
          </div>
        </div>
        <div class="col-md-12">
          <label class="form-label">평가준거</label>
          <textarea class="form-control criteria-input" rows="2">${data.criteria || ''}</textarea>
        </div>
      </div>
    `;
        // 삭제 버튼 연결
        card.querySelector('.remove-plan-btn')
            .addEventListener('click', () => card.remove());
        planRowsContainer.appendChild(card);
    }

    // 새 행 추가 버튼
    addBtn.addEventListener('click', () => addPlanRow());

    // 저장 버튼
    saveBtn.addEventListener('click', () => {
        const subject = subjectSelect.value;
        if (!subject) return alert('과목을 선택하세요.');
        const plans = Array.from(planRowsContainer.querySelectorAll('[data-id]'))
            .map(card => ({
                id: card.dataset.id,
                month: Number(card.querySelector('.month-input').value),
                goal: card.querySelector('.goal-input').value.trim(),
                content: card.querySelector('.content-input').value.trim(),
                methods: Array.from(card.querySelectorAll('.method-checkbox:checked')).map(cb => cb.value),
                criteria: card.querySelector('.criteria-input').value.trim()
            }));
        // state에 저장 예시
        state.plans[state.currentStudentId] = {
            ...(state.plans[state.currentStudentId] || {}),
            [subject]: plans
        };
        console.log('월별 목표:', state.plans);
        alert('탭2 월별 목표 저장 완료!');
        // TODO: Firebase 저장 로직 호출
    });

    // 초기 한 행
    addPlanRow();
}

// TODO: initTab3(), initTab4(), initTab5(), initTab6() 작성…
