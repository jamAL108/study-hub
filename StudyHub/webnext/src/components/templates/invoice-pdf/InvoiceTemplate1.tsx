import React from "react";

// Components
import  InvoiceLayout  from "./InvoiceLayout";



const InvoiceTemplate = (data: any) => {
    const { details } = data;
    console.log(details)
    return (
        <InvoiceLayout data={data}>
            <div className="flex p-10 items-center flex-col gap-5">
                {details.chats.map((chat:any,idx:number)=>(
                    <div className="flex w-full gap-2 flex-col " key={idx}>
                        <h2 className="text-lg font-bold">{chat.question}</h2>
                        <p className="text-md font-500">{chat.answer}</p>
                    </div>
                ))}
            </div>
        </InvoiceLayout>
    );
};

export default InvoiceTemplate;
