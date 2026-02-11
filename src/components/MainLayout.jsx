import Sidebar from './Sidebar';
import Slider from './Slider';
import RightSidebar from './RightSidebar';

function MainLayout() {
  return (
    <main className="main-layout">
      <Sidebar />
      <Slider />
      <RightSidebar />
    </main>
  );
}

export default MainLayout;
