
// 이 파일은 한글 내장 폰트가 포함된 커스텀 jsPDF라고 가정합니다
window.jspdf = {
  jsPDF: function () {
    return {
      setFont: () => {},
      text: (str, x, y) => { console.log('📄 PDF 텍스트:', str); },
      save: (filename) => { console.log('💾 PDF 저장됨:', filename); },
      getFontList: () => ({ ChosunGu: ['normal'] })
    };
  }
};
