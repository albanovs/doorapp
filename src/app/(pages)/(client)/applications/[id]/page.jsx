import React from 'react';

export default async function DetailPage({ params }) {
    const { id } = await params; // здесь id работает, потому что серверный компонент
    // можно сразу делать fetch по ID
    return (
        <div className="p-6">
            <h1 className="text-xl font-bold mb-4">Детали заявки</h1>
            <p>ID заявки: {id}</p>
        </div>
    );
}
