function Header() {
  const schemaData = {
    "@context": "https://schema.org",
    "@type": "Service",
    "serviceType": "재무설계 컨설팅",
    "provider": {
      "@type": "Organization",
      "name": "FPC",
      "url": "https://www.fpc-wp.com"
    },
    "description": "맞춤형 재무설계 컨설팅 서비스"
  };

  return (
    <header id="header">
      <nav>
        <div className="nav-content">
          <div className="logo-box">
            <img src="/image/FPC-Logo.png" alt="FPC Logo" className="logo" />
            <h1 id="vision1">FPC</h1>
          </div>
          <p id="vision2">
            금융에 대한 폭 넓은 시각으로 소비자에게 필요한 금융컨설팅 제공
          </p>
        </div>
      </nav>

      {/* 구조화 데이터 삽입 */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaData) }}
      />
    </header>
  );
}

export default Header;