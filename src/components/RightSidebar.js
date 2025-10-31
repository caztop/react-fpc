function RightSidebar() {
  return (
    <div className="right-sidebars">
      <div className="right-sidebar" id="blank2"></div>

      <div className="right-sidebar">
        <p>- 재무설계와 금융상품(발간 도서) -</p>
        <a
          href="https://product.kyobobook.co.kr/detail/S000216848258"
          target="_blank"
          rel="noopener noreferrer"
        >
          <img
            src="/image/FinBookQR.png"
            alt="재무설계와 금융상품 책구입 QR"
            style={{ maxWidth: '100px', height: 'auto' }}
          />
        </a>
        <br />
        <span>QR을 스캔하거나 클릭</span>
      </div>

      <div className="right-sidebar">오픈 예정</div>
      <div className="right-sidebar">오픈 예정</div>
    </div>
  );
}

export default RightSidebar;
