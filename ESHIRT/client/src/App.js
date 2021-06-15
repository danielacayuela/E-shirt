import './App.css';
import {Route, Switch, withRouter} from 'react-router-dom';
import {useEffect, useLayoutEffect, useRef, useState} from 'react';
import {useDispatch} from 'react-redux';
import {postUser} from './Actions/index.js';
import axios from 'axios';
import Home from './Components/Home/Home.jsx'
import MainNavBar from './Components/NavBar/MainNavBar.jsx';
import Catalogue from './Components/Catalogue/Catalogue.jsx';
import Footer from './Components/Footer/Footer.jsx';
import Design from './Components/Designer/Design.jsx';
import CreateCategory from './Components/Admin/CreateCategory/CreateCategory.jsx';
import Login from './Components/Login/Login';
import CreateUser from './Components/CreateUser/CreateUser';
import RecoveryAccount from './Components/RecoveryAccount/RecoveryAccount';
import Cart from './Components/Cart/Cart.jsx';
import Users from './Components/Admin/Users/Users';
import UserDetail from './Components/Admin/Users/UserDetail';
import UserEdit from './Components/Dashboard/User/UserEdit';
import UserOrders from './Components/Dashboard/User/UserOders';
import UserOrderDetail from './Components/Dashboard/User/UserOrderDetail';
import Error from './Components/Dashboard/Error';
import ProtectedRoute from './auth/ProtectedRoute';
import Account from './Components/Account/Account';
import HomeAdmin from './Components/Admin/HomeAdmin/HomeAdmin';
import ShirtsAdmin from './Components/Admin/ShirtsAdmin/ShirtsAdmin';
import Sales from './Components/Admin/Sales/Sales';
import OrderDetail from './Components/Admin/Sales/OrderDetail';
import DesignsAdmin from './Components/Admin/DesignsAdmin/DesignsAdmin'; 
import { useAuth0} from "@auth0/auth0-react";
import DesignDetail from './Components/Admin/DesignsAdmin/DesignDetail';
import Landing from './Components/Landing/Landing';
import NewDashboard from './Components/Dashboard/User/NewDashboard';
import ChatbotSelect from './Components/Chatbot/ChatbotSelect';
import ReviewContainer from './Components/Reviews/ReviewContainer';

import Favorites from './Components/Favorites/Favorites.jsx'
import AdminDashboard from './Components/Dashboard/Admin/AdminDashboard';
import UserDashboard from './Components/Dashboard/User/UserDashboard';
import UserData from './Components/Dashboard/User/UserData';
import AboutUs from './Components/AboutUs/AboutUs';
import RecycleBin from './Components/Admin/RecycleBin/RecycleBin';

import Payment from './Components/Cart/Payment/Payment'
import ScrollToTop from './hooks/windowPath';
import Reviews from './Components/Reviews/Reviews.jsx'

import RecycleBinShirt from './Components/Admin/RecycleBin/RecycleBinShirt';
import RecycleBinUser from './Components/Admin/RecycleBin/RecycleBinUser';
import RecycleBinDesigns from './Components/Admin/RecycleBin/RecycleBinDesigns';
import ShirtDetail from './Components/Admin/ShirtsAdmin/ShirtDetail';
import Admins from './Components/Admin/Users/Admins';
import Discount from './Components/Admin/Discount/Discounts';
import Discounts from './Components/Admin/Discount/Discounts';
import BuyAuthorizeDesigns from './Components/Admin/DesignsAdmin/BuyAuthorizeDesingns';
import swal from 'sweetalert';






function App({location}) {

  const {isAuthenticated, getAccessTokenSilently, user } = useAuth0();
  const [current, setCurrent] = useState(window.location.pathname);
  const dispatch = useDispatch();
  const topRef = useRef(null);
  


  useEffect(() => {
    let token;
    (async () => {
      try {

      

        if(isAuthenticated){
          token = await getAccessTokenSilently({
            audience: `${process.env.REACT_APP_AUTH0_AUDIENCE}`,
          })
          const { name, sub, email } = user;
          
          const userToPost ={
            id: sub.split('|')[1],
            name,
            email
          } 

                try {

                    const checkDB = await axios({
                        method: 'GET',
                        url: `/user/${userToPost.id}`,
                        headers: {
                          Authorization: `Bearer ${token}`
                        }
                    })
                    swal({ 
                      title: "Signed up", 
                      text: `Welcome Back ${name}`,
                      icon: "success",
                      timer: 3000,
                      padding: "0.75rem"
                      });
                    
                  

              }catch(err) {
                
                  dispatch(postUser(userToPost));
                  /* alert(`Welcome to our website ${name}`) */
                  

              }
              localStorage.setItem('currentToken', token)
          
        }


        return;
      } catch (e) {
        console.error(e);
        alert('Error on login:', e)

      }
    })();

    return ()=> localStorage.removeItem('currentToken')
    

  }, [isAuthenticated, localStorage.currentToken]);

 

  return (
    <div>
      <ScrollToTop />
      <Switch >
      
      
      
      <Route exact path= '/' component={Landing}/>
      
      <div className= 'App' >
      
      
      <MainNavBar />  
      <Route exact path= '/newDashBoard' component={NewDashboard}/> 
      {/* <Route path= '/' component={MainNavBar}/>   */}
      <ProtectedRoute path= '/userDash' component={UserDashboard}/> 
      <ProtectedRoute path= '/userData' component={UserData}/> 
      <ProtectedRoute path= '/userEdit' component={UserEdit}/> 
      <ProtectedRoute path= '/userOrders' component={UserOrders}/> 
      <ProtectedRoute path= '/userOrderDetail/:orderId' component={UserOrderDetail}/> 
      <Route exact path= '/catalogue' component={Catalogue}/>  
      <Route exact path= '/home' component={Home}/>
      <Route exact path= '/error' component={Error}/>
      <Route exact path= '/design' component={Design}/>
      <ProtectedRoute exact path= '/cart' component={Cart}/> 
      <Route exact path= '/login' component={Login}/>
      <Route exact path= '/adminDash' component={AdminDashboard}/>
      <Route exact path= '/aboutUs' component={AboutUs}/>
      <ProtectedRoute exact path= '/recycleBin' component={RecycleBin}/>
      <ProtectedRoute exact path= '/recycleBinShirt' component={RecycleBinShirt}/>
      <ProtectedRoute exact path= '/recycleBinUser' component={RecycleBinUser}/>
      <ProtectedRoute exact path= '/recycleBinDesigns' component={RecycleBinDesigns}/>
      <ProtectedRoute exact path= '/create_user'  component={CreateUser}/>
      <ProtectedRoute exact path= '/home_admin'  component={HomeAdmin}/> 
      <ProtectedRoute exact path= '/add_category'  component={CreateCategory}/> 
      <ProtectedRoute path= '/users'  component={Users}/>
      <ProtectedRoute path= '/admins'  component={Admins}/>
      <Route path= '/shirt/:id/review' component={ReviewContainer}/>
      <ProtectedRoute exact path= '/user_detail/:id'  component={UserDetail}/>
      <ProtectedRoute exact path= '/shirts_admin'  component={ShirtsAdmin}/>
      <ProtectedRoute exact path= '/shirt_detail/:id'  component={ShirtDetail}/>
      <ProtectedRoute exact path= '/sales'  component={Sales}/>
      <ProtectedRoute exact path= '/order_detail/:id'  component={OrderDetail}/>
      <ProtectedRoute exact path= '/desings_admin'  component={DesignsAdmin}/>
      <ProtectedRoute exact path= '/buy_authorize'  component={BuyAuthorizeDesigns}/>
      <ProtectedRoute exact path= '/discounts'  component={Discounts}/> 
      <ProtectedRoute exact path= '/favorites' component={Favorites}/>
      <ProtectedRoute exact path= '/design_detail' component={DesignDetail}/>
      <Route exact path= '/recovery_account' component={RecoveryAccount}/>
      <ProtectedRoute path='/account' component={Account} />
      <ProtectedRoute path='/payment' component={Payment} />
      <ChatbotSelect/>
      <Footer/>
      </div>  

      </Switch>
    </div>
  )
}

export default App;
