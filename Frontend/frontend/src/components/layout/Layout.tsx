import Sidebar from './Sidebar';
import Header from './Header';
import './Layout.css';

interface LayoutProps {
  children: React.ReactNode;
  setIsLoggedIn: (value: boolean) => void;
}

const Layout = ({ children, setIsLoggedIn }: LayoutProps) => {
  return (
    <div className="layout">
      {/* Truyền setIsLoggedIn xuống Sidebar */}
      <Sidebar setIsLoggedIn={setIsLoggedIn} />

      <div className="main-content">
        <Header />  {/* Header giờ không cần prop */}
        <div className="page-content">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Layout;
