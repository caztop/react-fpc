import './App.css'
import './css/main.css';
import Header from './components/Header';
import MainLayout from './components/MainLayout';
import InfoSection from './components/InfoSection';
import InquiryForm from './components/InquiryForm';
import Footer from './components/Footer';

function App() {
  return (
    <div className="container">
      <Header />
      <MainLayout />
      <InfoSection />
      <InquiryForm />
      <Footer />
    </div>
  );
}

export default App;
