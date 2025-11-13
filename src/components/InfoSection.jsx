function InfoSection() {
  const boxes = [
    { img: 'comerstone.jpg', label: '주춧돌 세우기', url: 'info/comerstone.png' },
    { img: 'chart.png', label: '경제지표', url: 'info/ecoflow.png' },
    { img: 'apartments.png', label: '부동산 시장', url: 'info/property.png' },
    { img: 'tax.jpg', label: '세금', url: 'info/tax.png' },
    { img: 'tsave.png', label: '세제혜택 금융상품', url: 'info/tsave.png' },
    { img: 'fsite.png', label: '재무설계관련 인터넷사이트', url: 'info/fsite.png' },
  ];

  const handleClick = (url) => window.open(url, '_blank');

  return (
    <>
      <div id="blank3"></div>
      <div id="info">정보마당</div>
      <div className="mbox">
        {boxes.map((box, i) => (
          <div className="box" key={i} onClick={() => handleClick(box.url)}>
            <img src={`/image/${box.img}`} alt="그림" />
            <div>{box.label}</div>
          </div>
        ))}
        <button className="box" onClick={() => handleClick('doc7.html')}>추가예정</button>
      </div>
    </>
  );
}

export default InfoSection;
