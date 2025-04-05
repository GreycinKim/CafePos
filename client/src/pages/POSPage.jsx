import React, { useState } from 'react';

const menuItems = [
    { id: 1, name: 'Espresso', price: 2 },
    { id: 2, name: 'Latte', price: 4 },
    { id: 3, name: 'Lemonade', price: 2.5 },
    { id: 4, name: 'Matcha', price: 2.5 },
    { id: 5, name: 'Ube', price: 2.5 },

];

export default function POSPage() {
    const [cart, setCart] = useState([]);

    const addToCart = (item) => {
        setCart([...cart, item]);
    };

    const total = cart.reduce((acc, item) => acc + item.price, 0);

    const handleCheckout = async () => {
        try {
            const response = await fetch('http://localhost:5000/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(cart),
            });

            const data = await response.json();
            console.log(data.message);

            setCart([]); // Clear cart after success
        } catch (error) {
            console.error('Error sending order:', error);
        }
    };


    return (
        <div className="p-4 max-w-4xl mx-auto">
            <h1 className="text-2xl font-bold mb-4">Cafe POS</h1>

            <div className="grid grid-cols-3 gap-4 mb-6">
                {menuItems.map(item => (
                    <button
                        key={item.id}
                        className="bg-blue-200 p-4 rounded shadow hover:bg-blue-300 transition"
                        onClick={() => addToCart(item)}
                    >
                        {item.name} - ${item.price}
                    </button>
                ))}
            </div>

            <div className="border-t pt-4">
                <h2 className="text-xl font-semibold mb-2">Current Order</h2>
                {cart.length === 0 ? (
                    <p>No items in cart.</p>
                ) : (
                    <>
                        <ul className="mb-2">
                            {cart.map((item, index) => (
                                <li key={index}>{item.name} - ${item.price}</li>
                            ))}
                        </ul>
                        <p className="font-bold">Total: ${total.toFixed(2)}</p>
                        <button
                            className="bg-green-500 text-white px-4 py-2 rounded mt-2 hover:bg-green-600"
                            onClick={handleCheckout}
                        >
                            Complete Sale
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}
