// import React from 'react'
// import { useAppContext } from '../context/AppContext';
// import { useLocation } from 'react-router-dom';
// import { useEffect } from 'react';

// const Loading=()=>{

//     const {navigate}=useAppContext();
//     let {search}= useLocation()
//     const query= new URLSearchParams(search)
//     const nextUrl=query.get('next');

//     useEffect(()=>{
//         if(nextUrl){
//             setTimeout(()=>{
//                 navigate(`/${nextUrl}`)
//             },5000)
//         }
//     },[])
//     return(
//         <div className="flex justify-center items-center h-screen">
//             <div className="animate-spin rounded-full h-24 w-24 border-4 border-gray-300 
//              border-t-primary"> </div>
//         </div>
//     )
// }
// export default Loading;


import React, { useEffect } from 'react';
import { useAppContext } from '../context/AppContext';
import { useLocation, useNavigate } from 'react-router-dom';

const Loading = () => {
    const { setCartItems, axios, user } = useAppContext();
    const navigate = useNavigate();
    
    const { search } = useLocation();
    const query = new URLSearchParams(search);
    const nextUrl    = query.get('next');
    const sessionId  = query.get('session_id');
    const orderId    = query.get('orderId');

    // Effect 1: Clear frontend cart immediately on mount
    useEffect(() => {
        setCartItems({});
    }, []);

    // Effect 2: Once user loads, verify Stripe payment and clear DB cart
    useEffect(() => {
        if (!user) return;

        const verifyAndRedirect = async () => {
            // ── Verify Stripe payment (sets isPaid:true in DB) ──────────────
            if (sessionId && orderId) {
                try {
                    const { data } = await axios.get(
                        `/api/order/verify?sessionId=${sessionId}&orderId=${orderId}`
                    );
                    if (data.success) {
                        console.log('✅ Payment verified — isPaid set to true');
                    } else {
                        console.warn('⚠️ Payment verification failed:', data.message);
                    }
                } catch (err) {
                    console.log('Verify error:', err.message);
                }
            }

            // ── Clear DB cart so navbar badge shows 0 ───────────────────────
            try {
                await axios.post('/api/cart/update', {
                    userId: user._id,
                    cartItems: {}
                });
                setCartItems({});
            } catch (err) {
                console.log('Cart clear error:', err.message);
            }

            // ── Navigate to next page ────────────────────────────────────────
            if (nextUrl) {
                setTimeout(() => navigate(`/${nextUrl}`), 1500);
            }
        };

        verifyAndRedirect();
    }, [user]);

    return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-24 w-24 border-4 border-gray-300 border-t-primary"></div>
        </div>
    );
}

export default Loading;
