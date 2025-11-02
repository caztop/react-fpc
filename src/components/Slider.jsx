import { useState } from 'react';

function Slider() {
  const [index, setIndex] = useState(0);
  const slides = [
    {
      title: '교육 부문',
      items: [
        '▶ 생명보험 설계사교육 : 생명보험상품 판매를 위한 교육',
        '▶ 일반기업 직원교육 : 일반회사 직원의 복리증진을 위한 금융교육',
        '▶ 일반인 금융교육 : 금융거래를 위한 금융제도 및 상품 이해',
        '▶ 기타 : 여러 단체 소속원의 슬기로운 금융생활을 위한 교육',
      ],
    },
    {
      title: '컨텐츠 제작 부문',
      items: [
        '▶ 보험업 종사자를 위한 뉴스지 : Bi-Weekly News(격주 발간)',
        '▶ 보험업 종사자를 위한 분야별 시리즈 교재 제작',
        '▶ 보험업 종사자를 위한 교재 제작(의뢰제작)',
        '▶ 일반인을 위한 금융서적 발간(기 발간서적 : 재무설계와 금융상품)',
      ],
    },
    {
      title: '컨설팅 부문',
      items: [
        '▶ 간단 재무설계 컨설팅 : 약 30분의 시간으로 간단히 해 보는 재무설계',
        '▶ 집중 재무설계 컨설팅 : 온 가족이 함께 계획하는 재무설계',
        '▶ 기타 재무설계 및 금융 관련 컨설팅이 필요한 소비자 컨설팅',
        "▶ 참고 : 컨설팅은 '재무설계와 금융상품' 저자가 개인별 맞춤으로 진행",
      ],
    },
  ];

  return (
    <section className="content">
      <div id="blank1"></div>
      <div id="slide-name">FPC가 하는 일</div>
      <div className="slider-container">
        <div className="slider" style={{ transform: `translateX(-${index * 100}%)` }}>
          {slides.map((slide, i) => (
            <div className="slide" key={i}>
              <h2>{slide.title}</h2>
              <ul>
                {slide.items.map((item, j) => (
                  <li key={j}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <button className="prev" onClick={() => index > 0 && setIndex(index - 1)}>&lt;</button>
        <button className="next" onClick={() => index < slides.length - 1 && setIndex(index + 1)}>&gt;</button>
      </div>
    </section>
  );
}

export default Slider;
