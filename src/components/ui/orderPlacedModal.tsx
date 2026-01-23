'use client'
import { useOrders } from "@/context/context"
import ModalComponent from "./modalComponent"
import {useState} from "react";

export default function OrderPlacedModal() {
  const {currentClient, cartItems} = useOrders();
  const [isOpen, setIsOpen] = useState(false);

  console.log("currentClient", currentClient, "cartItems", cartItems);

  return(
   <ModalComponent open={isOpen} onClose={() => {setIsOpen(false)}}>
    <h1>Pedido Realizado!</h1>    
   </ModalComponent>
  )
}