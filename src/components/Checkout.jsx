import { useContext } from "react";
import Modal from "./Modal";
import CartContext from "../store/CartContext";
import { currencyFormatter } from "../util/formatting";
import Input from "./UI/Input";
import Button from "./UI/Button";
import UserProgressContext from "../store/UserProgressContext";
import useHttp from "../hooks/useHttp";
import Error from "./Error";

//Config for POST method
const requestConfig = {
    method: 'POST',
    headers: {
        'Content-Type' : 'application/json'
    }
}

//Checkout component for displaying final form for the user to insert necessary data
export default function Checkout(){
    const cartCtx = useContext(CartContext);
    const userProgressCtx = useContext(UserProgressContext);

    const{data, isLoading: isSending, error, sendRequest, clearData } = useHttp('http://localhost:3000/orders', requestConfig);

    //total order price
    const cartTotal = cartCtx.items.reduce((totalPrice, item) => totalPrice + item.quantity * item.price , 0);

    function handleClose(){
        userProgressCtx.hideCheckout();
    }

    function handleFinish(){
        userProgressCtx.hideCheckout();
        cartCtx.clearCart();
        clearData();
    }

    //form submit function
    function handleSubmit(event){
        event.preventDefault();

        const fd = new FormData(event.target);
        //transform form data into object
        const customerData = Object.fromEntries(fd.entries());

        //sending form data to the dummy backend
        sendRequest(JSON.stringify({
            order: {
                items: cartCtx.items,
                customer: customerData
            }
        }));
    }

    let actions = (
        <>
            <Button textOnly type="button" onClick={handleClose}>Close</Button>
            <Button>Submit Order</Button>
        </>
    );

    //conditional UI element for awaiting backend response
    if(isSending){
        actions = <span>Sending order data...</span>
    }

    //conditional UI handling in case of no errors
    if(data && !error){
        return <Modal open={userProgressCtx.progress === 'checkout'} onClose={handleFinish}>
            <h2>Success!</h2>
            <p>Your order was submitted successfully.</p>
            <p>We will get back to you with more detaile via email within the next few minutes.</p>
            <p className="modal-actions">
                <Button onClick={handleFinish}>Okay</Button>
            </p>
        </Modal>
    }

    return <Modal open={userProgressCtx.progress === 'checkout'} onClose={handleClose}>
        <form onSubmit={handleSubmit}>
            <h2>Checkout</h2>
            <p>Total Amount: {currencyFormatter.format(cartTotal)}</p>

            <Input label="Full Name" type="text" id="name"/>
            <Input label="E-Mail Address" type="email" id="email"/>
            <Input label="Street" type="text" id="street"/>
            <div className="control-row">
                <Input label="Postal Code" type="text" id="postal-code"/>
                <Input label="City" type="text" id="city"/>
            </div>

            {/*Conditional UI element in case of error*/}
            {error && <Error title="Failed to submit order" message={error}/>}
            
            <p className="modal-actions">
                {actions}
            </p>
        </form>
    </Modal>
}