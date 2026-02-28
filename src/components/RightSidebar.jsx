function RightSidebar() {
  return (
    <div className="right-sidebars">
      <div className="right-sidebar" id="blank2"></div>

      <div className="right-sidebar qr-box">
        <p>- 재무설계와 금융상품(발간 도서) -</p>

        <div className="qr-row">
          <a
            href="https://product.kyobobook.co.kr/detail/S000216848258"
            target="_blank"
            rel="noopener noreferrer"
          >
            <img src="/image/FinBookQR.png" alt="QR" />
          </a>
          <span>QR을 스캔하거나 클릭</span>
        </div>
      </div>
      <div className="right-sidebar">
        <a href="https://blog.fpc-wp.com" target="_blank" rel="noopener noreferrer">
        FPC 공식블로그<br />
        <span className="sub-text">(상담사례,시장현황,투자방법 등 기록)</span>
        </a>
      </div>
      <div className="right-sidebar">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            alert("준비 중입니다.😊");
          }}
        >FPC 공식 SNS<br />
          <span className="sub-text">(다양한 SNS 채널 오픈예정)</span>
        </a>
      </div>
    </div>
  );
}

export default RightSidebar;