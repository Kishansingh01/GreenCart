
// import React from 'react'
// import { useEffect } from 'react';
// import { useAppContext } from '../context/AppContext';
// import { NavLink } from "react-router-dom";
// import { assets } from '../assets/assets';


// const NavBar=()=>{ 

//     const [open, setOpen] = React.useState(false)
//     const { user, setUser,setShowUserLogin,navigate,setSearchQuery,searchQuery,getCartCount } = useAppContext();

//     const logout=async()=>{
//         setUser(null);
//         navigate('/')
//                           }

//     useEffect(()=>{
//         if(searchQuery.length > 0){
//             navigate("/products")
//                                   }
//     },[searchQuery])

//     return(
//          <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white relative transition-all">

//             <NavLink to="/" onClick={()=>setOpen(false)}>
//                 <img className="h-9" src={assets.logo} alt="logo"/>
//             </NavLink>

//             {/* Desktop Menu */}
//             <div className="hidden sm:flex items-center gap-8">
//                 <NavLink to="/">Home</NavLink>
//                 <NavLink to="/products">All Product</NavLink>
//                 <NavLink to="/">Contact</NavLink>

//                 <div className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 rounded-full">
//                     <input onChange={(e)=>setSearchQuery(e.target.value)} className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500" type="text" placeholder="Search products" />
//                     <img src={assets.search_icon} alt="search" className="w-4 h-4"/>
                    
//                 </div>

//                 <div onClick={()=>{navigate("/cart")}}className="relative cursor-pointer">
//                     <img src={assets.cart_icon} alt="cart" className="w-6 opacity-60"/>
        
//                     <button className="absolute -top-2 -right-3 text-xs text-white bg-primary
//                      w-[18px] h-[18px] rounded-full">{getCartCount()}</button>
//                 </div>
 
//                {!user ? ( <button onClick={()=>setShowUserLogin(true)} className="cursor-pointer px-8 py-2 bg-primary hover:bg-primary-dull transition text-white rounded-full">
//                     Login
//                 </button>):
//                 (
//                     <div className="relative group">
//                         <img src={assets.profile_icon} className="w-10" alt=""/>
//                         <ul className="hidden group-hover:block absolute top-10 right-0 bg-white shadow border border-gray-200 py-2.5 w-30 rounded-md text-sm z-40">
//                             <li onClick={()=>navigate("my-orders")} className="p-1.5 pl-3 hover:bg-primary/10 cursor-pointer">My Orders</li>
//                             <li onClick={logout}className="p-1.5 pl-3 hover:bg-primary/10 cursor-pointer">LogOut</li>
//                         </ul>
//                     </div>
//                  )
//                 }
//             </div>
  
//               {/* Mobile Button */}
//               <div className="flex items-center gap-6 sm:hidden">
//                  <div onClick={()=>{navigate("/cart")}}className="relative cursor-pointer">
//                     <img src={assets.cart_icon} alt="cart" className="w-6 opacity-60"/>
        
//                     <button className="absolute -top-2 -right-3 text-xs text-white bg-primary
//                      w-[18px] h-[18px] rounded-full">{getCartCount()}</button>
//                 </div>

//                  <button onClick={() => open ? setOpen(false) : setOpen(true)} aria-label="Menu" className="">
//                  <img src={assets.menu_icon}/>
//                 </button>

//               </div>

           
//            {  open && (
//             <div className={`${open ? 'flex' : 'hidden'} absolute top-[60px] left-0 w-full bg-white shadow-md py-4 flex-col items-start gap-2 px-5 text-sm md:hidden`}>
//                 <NavLink to="/" onClick={()=>setOpen(false)}>Home</NavLink>
//                 <NavLink to="/products" onClick={()=>setOpen(false)}>All products</NavLink>

//                  {  user &&
//                     <NavLink to="/products" onClick={()=>setOpen(false)}>My Orders</NavLink>
//                  }
//                 <NavLink to="/" onClick={()=>setOpen(false)}>Contact</NavLink>
                
//                 {!user ? (
//                     <button onClick={()=>{
//                         setOpen(false);
//                         setShowUserLogin(true)
//                     }} className="cursor-pointer px-6 py-2 mt-2 bg-primary-dull hover:bg-primary transition text-white rounded-full text-sm">
//                       Login 
//                     </button>
//                 ) : (
//                      <button  onClick={logout} className="cursor-pointer px-6 py-2 mt-2 bg-primary-dull hover:bg-primary transition text-white rounded-full text-sm">
//                     Logout
//                    </button>
//                 )}
                
//             </div>
//             )}
//         </nav>
//     )
// }

// export default NavBar;



import React, { useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { NavLink } from "react-router-dom";
import { assets } from '../assets/assets';
import toast from "react-hot-toast";

const NavBar = () => { 
    const [open, setOpen] = React.useState(false);
    const { user, setUser, setShowUserLogin, navigate, setSearchQuery,
             axios, searchQuery, getCartCount } = useAppContext();

    const logout = async () => {
        try{
            const {data} = await axios.post('/api/user/logout')
            if(data.success){
                toast.success(data.message)
                setUser(null);
               navigate('/');
            }
            else{
                toast.error(data.message);
            }
           }
        catch(error){
            toast.error(error.message)

        }
     
    };

    useEffect(() => {
        if (searchQuery.length > 0) {
            navigate("/products");
        }
    }, [searchQuery]);

    return (
        // Added z-50 to ensure the navbar and its dropdown stay above other page content
        <nav className="flex items-center justify-between px-6 md:px-16 lg:px-24 xl:px-32 py-4 border-b border-gray-300 bg-white relative transition-all z-50">

            {/* Logo */}
            <NavLink to="/" onClick={() => setOpen(false)}>
                <img className="h-9" src={assets.logo} alt="logo"/>
            </NavLink>

            {/* --- Desktop Menu --- */}
            {/* Changed from sm:flex to md:flex to prevent layout breaking on tablets */}
            <div className="hidden md:flex items-center gap-8">
                <NavLink to="/" className="hover:text-primary transition">Home</NavLink>
                <NavLink to="/products" className="hover:text-primary transition">All Products</NavLink>
                <NavLink to="/contact" className="hover:text-primary transition">Contact</NavLink>

                {/* Search Bar (Hidden on smaller screens, shown on lg) */}
                <div className="hidden lg:flex items-center text-sm gap-2 border border-gray-300 px-3 py-0.5 rounded-full focus-within:border-primary transition">
                    <input 
                        onChange={(e) => setSearchQuery(e.target.value)} 
                        className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500" 
                        type="text" 
                        placeholder="Search products" 
                    />
                    <img src={assets.search_icon} alt="search" className="w-4 h-4"/>
                </div>

                {/* Cart Icon */}
                <div onClick={() => navigate("/cart")} className="relative cursor-pointer">
                    <img src={assets.cart_icon} alt="cart" className="w-6 opacity-60 hover:opacity-100 transition"/>
                    <button className="absolute -top-2 -right-3 text-xs text-white bg-primary w-[18px] h-[18px] flex items-center justify-center rounded-full">
                        {getCartCount()}
                    </button>
                </div>
 
                {/* User Authentication / Profile */}
                {!user ? ( 
                    <button onClick={() => setShowUserLogin(true)} className="cursor-pointer px-8 py-2 bg-primary hover:bg-opacity-90 transition text-white rounded-full">
                        Login
                    </button>
                ) : (
                    <div className="relative group">
                        <img src={assets.profile_icon} className="w-10 cursor-pointer" alt="profile"/>
                        <ul className="hidden group-hover:block absolute top-10 right-0 bg-white shadow-md border border-gray-200 py-2 w-32 rounded-md text-sm z-50">
                            <li onClick={() => navigate("/my-orders")} className="p-2 pl-4 hover:bg-gray-100 cursor-pointer transition">My Orders</li>
                            <li onClick={logout} className="p-2 pl-4 hover:bg-gray-100 cursor-pointer transition text-red-500">Log Out</li>
                        </ul>
                    </div>
                )}
            </div>
  
            {/* --- Mobile View Elements --- */}
            {/* Changed sm:hidden to md:hidden to match the desktop breakpoint */}
            <div className="flex items-center gap-5 md:hidden">
                
                {/* Mobile Cart Icon */}
                <div onClick={() => navigate("/cart")} className="relative cursor-pointer">
                    <img src={assets.cart_icon} alt="cart" className="w-6 opacity-60"/>
                    <button className="absolute -top-2 -right-3 text-[10px] text-white bg-primary w-[18px] h-[18px] flex items-center justify-center rounded-full">
                        {getCartCount()}
                    </button>
                </div>

                {/* Hamburger Menu Button */}
                <button onClick={() => setOpen(!open)} aria-label="Menu" className="p-1">
                    <img src={assets.menu_icon} className="w-6" alt="menu"/>
                </button>
            </div>

            {/* --- Mobile Dropdown Menu --- */}
            {open && (
                // Changed top-[60px] to top-full so it always attaches perfectly to the bottom of the navbar
                <div className="absolute top-full left-0 w-full bg-white shadow-lg py-5 flex flex-col items-start px-6 text-base md:hidden border-t border-gray-200 z-50">
                    
                    {/* Added Mobile Search Bar so mobile users can also search */}
                    <div className="w-full flex items-center gap-2 border border-gray-300 px-3 py-1 rounded-full mb-4">
                        <input 
                            onChange={(e) => setSearchQuery(e.target.value)} 
                            className="py-1.5 w-full bg-transparent outline-none placeholder-gray-500 text-sm" 
                            type="text" 
                            placeholder="Search products" 
                        />
                        <img src={assets.search_icon} alt="search" className="w-4 h-4"/>
                    </div>

                    {/* Formatted links with padding and full-width for easy finger-tapping */}
                    <NavLink to="/" onClick={() => setOpen(false)} className="w-full py-3 border-b border-gray-100">Home</NavLink>
                    <NavLink to="/products" onClick={() => setOpen(false)} className="w-full py-3 border-b border-gray-100">All Products</NavLink>
                    <NavLink to="/contact" onClick={() => setOpen(false)} className="w-full py-3 border-b border-gray-100">Contact</NavLink>

                    {user && (
                        // Fixed the bug in your code where 'My Orders' redirected to '/products'
                        <NavLink to="/my-orders" onClick={() => setOpen(false)} className="w-full py-3 border-b border-gray-100">My Orders</NavLink>
                    )}
                    
                    {!user ? (
                        <button onClick={() => { setOpen(false); setShowUserLogin(true); }} className="w-full cursor-pointer px-6 py-2.5 mt-4 bg-primary hover:bg-opacity-90 transition text-white rounded-full text-center">
                            Login 
                        </button>
                    ) : (
                        <button onClick={() => { setOpen(false); logout(); }} className="w-full cursor-pointer px-6 py-2.5 mt-4 bg-red-500 hover:bg-red-600 transition text-white rounded-full text-center">
                            Logout
                        </button>
                    )}
                </div>
            )}
        </nav>
    );
};

export default NavBar;