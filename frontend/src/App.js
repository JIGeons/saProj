import LoginPage from './component/page/LoginPage'
import Footer from './component/page/Footer';
import {BrowserRouter, Routes, Route} from "react-router-dom";
import Signup from './component/page/Signup_page';
import Product from './component/page/ProductList';
import ProductDetail from './component/page/ProductDetail';

function App() {
  return (
    <BrowserRouter>
      <div className="wrapper">
        <div className='contentWrapper'>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="users/signup" element={<Signup />} />
            <Route path="posts/productlist" element={<Product />} />
            <Route path="posts/productlist/productdetail/:id" element={<ProductDetail />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </BrowserRouter>
  );
}
export default App;
