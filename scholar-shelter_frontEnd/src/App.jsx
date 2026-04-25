//mention all routing here ,first  exe fle 

import {BrowserRouter as Router,Routes,Route} from 'react-router-dom';
import './App.css';
import Front from './pages/Front';
import Home from './pages/Home';
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import PGFinder from "./pages/PGFinder"; 
import AddPG from "./pages/AddPG";
import EditPG from "./pages/EditPG";
import UserPanel from "./components/UserPanel";
import PGDetails from "./pages/PGDetails";
import ShortListed from "./components/ShortListed";
// import AccountSettings from './components/AccountSettings';
function App() {
  

  return (
    <div className="container">
      
      <Router>
        <Routes>
          <Route path="/" element={<Front/>}/>
          <Route path="/Home" element={<Home/>}/>
          <Route path="/Login" element={<Login/>}/>
          <Route path="/Signup" element={<Signup/>}/>
          <Route path="/UserPanel" element={<UserPanel/>}/>
          <Route path="/Search" element={<PGFinder />} />
          <Route path="/addpg" element={<AddPG />} />
          <Route path="/pg/:id" element={<PGDetails />} />
          <Route path="/edit-pg/:id" element={<EditPG />} />
          <Route path="/rooms" element={<ShortListed />} />
          {/* <Route path="/settings" element={<AccountSettings user={user} />} /> */}
        </Routes>
      </Router>

   </div>
  
  )
}

export default App
