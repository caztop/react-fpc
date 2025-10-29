import Sidebar from './Sidebar';
import Slider from './Slider';

function MainLayout() {
  return (
    <main className="main-layout">
      <Sidebar />
      <Slider />
      <div className="right-sidebars">
        <div className="right-sidebar" id="blank2"></div>
        <div className="right-sidebar">
          <p></p>
        </div>
      </div>
    </main>
  );
}

export default MainLayout;
