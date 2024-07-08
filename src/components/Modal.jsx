import { useEffect, useRef } from "react";
import { createPortal } from "react-dom"

//Generic modal component for displaying cart & checkout
export default function Modal({children, open, onClose, className = ''}){
    const dialog = useRef();

    useEffect(() => {
        const modal = dialog.current;
        if(open){
            modal.showModal();
        }

        return () => modal.close();
    }, [open]);

    //portal created to disconnect cart or checkout components from the DOM
    return createPortal(
    <dialog ref={dialog} className={`modal ${className}`} onClose={onClose}>{children}</dialog>, 
    document.getElementById('modal')
    );
}